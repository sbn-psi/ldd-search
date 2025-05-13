import os
import subprocess
import shutil
from pathlib import Path
import yaml
import json
import glob

def load_yaml_data():
    with open('internal/src/data_dictionary.yaml', 'r') as file:
        return yaml.safe_load(file)

def validate_yaml_data(data):
    required_keys = ['classes', 'attributes']
    for key in required_keys:
        if key not in data:
            raise ValueError(f"Missing required key: {key}")

def get_class_attributes(data, class_name):
    if class_name not in data['classes']:
        return []
    
    attributes = []
    for assoc in data['classes'][class_name]['associations']:
        if assoc['reference_type'] == 'attribute_of':
            attributes.append(assoc['identifier_reference'])
    
    return attributes

def get_class_hierarchy(data, class_name, hierarchy=None, processed=None):
    """Get the hierarchy of classes including nested classes."""
    if hierarchy is None:
        hierarchy = {}
    
    # Track processed classes to prevent infinite recursion
    if processed is None:
        processed = set()
    
    # If we've already processed this class or it doesn't exist, return early
    if class_name in processed or class_name not in data['classes']:
        return hierarchy
    
    # Mark this class as processed
    processed.add(class_name)
    
    class_data = data['classes'][class_name]
    attributes = []
    nested_classes = {}
    
    # Get attributes directly from associations
    for assoc in class_data['associations']:
        if assoc['reference_type'] == 'attribute_of':
            attributes.append(assoc['identifier_reference'])
        elif assoc['reference_type'] == 'subclass_of':
            subclass_name = assoc['identifier_reference']
            if subclass_name not in processed:  # Skip if already processed
                nested_classes[subclass_name] = {}
                get_class_hierarchy(data, subclass_name, nested_classes[subclass_name], processed)
    
    hierarchy['attributes'] = attributes
    hierarchy['nested_classes'] = nested_classes
    return hierarchy

def process_yaml_data(data):
    # Process classes
    classes = {}
    top_level_classes = {}
    
    # First find top-level element classes
    for class_name, class_data in data['classes'].items():
        if class_data.get('element_flag', False):
            top_level_classes[class_name] = True

    # Process each top-level class and its hierarchy
    processed_set = set()  # Track all processed classes to prevent duplicates
    for class_name in top_level_classes:
        class_data = data['classes'][class_name]
        # Get class hierarchy
        hierarchy = {}
        get_class_hierarchy(data, class_name, hierarchy, processed_set.copy())
        
        # Add to classes dictionary
        classes[class_name] = {
            'definition': class_data['definition'],
            'element_flag': True,
            'attributes': hierarchy['attributes'],
            'nested_classes': hierarchy['nested_classes']
        }
    
    # Add all other classes (needed for nested class references)
    for class_name, class_data in data['classes'].items():
        if class_name not in classes and class_name not in processed_set:
            # Get class hierarchy
            hierarchy = {}
            get_class_hierarchy(data, class_name, hierarchy, processed_set.copy())
            
            # Add to classes dictionary
            classes[class_name] = {
                'definition': class_data['definition'],
                'element_flag': False,
                'attributes': hierarchy['attributes'], 
                'nested_classes': hierarchy['nested_classes']
            }
    
    # Process attributes
    attributes = {}
    for attr_name, attr_data in data['attributes'].items():
        attr_info = {
            'definition': attr_data['definition']
        }
        
        if attr_data.get('value_domain', {}).get('enumeration_flag', False):
            if 'permissible_values' in attr_data.get('value_domain', {}):
                attr_info['permissible_values'] = attr_data['value_domain']['permissible_values']
        
        attributes[attr_name] = attr_info
    
    return {
        'classes': classes,
        'attributes': attributes
    }

def build_web_form():
    # Load and validate YAML data
    yaml_data = load_yaml_data()
    validate_yaml_data(yaml_data)  # Validate before processing
    processed_data = process_yaml_data(yaml_data)
    
    # --- Generate and version the mapping ---
    mapping_dir = Path('internal/src/web')
    mapping_files = sorted(glob.glob(str(mapping_dir / 'web_form_mapping_v*.json')))
    latest_version = 0
    latest_mapping = None
    if mapping_files:
        latest_file = mapping_files[-1]
        with open(latest_file, 'r') as f:
            latest_mapping = json.load(f)
            latest_version = latest_mapping.get('version', 0)

    # Generate new mapping (sorted order)
    class_list = sorted(processed_data['classes'].keys())
    attr_list = sorted(processed_data['attributes'].keys())
    # Build permissible values mapping
    permissible_values = {}
    for attr in attr_list:
        attr_info = processed_data['attributes'][attr]
        if 'permissible_values' in attr_info:
            # Store sorted list for stable bitfield mapping
            permissible_values[attr] = sorted(attr_info['permissible_values'].keys())
    mapping_changed = (
        not latest_mapping or
        latest_mapping['classes'] != class_list or
        latest_mapping['attributes'] != attr_list or
        latest_mapping.get('permissible_values', {}) != permissible_values
    )
    new_version = latest_version + 1 if mapping_changed else latest_version
    new_mapping = {
        'version': new_version,
        'classes': class_list,
        'attributes': attr_list,
        'permissible_values': permissible_values
    }

    # Only save if changed or no mapping exists
    if mapping_changed:
        mapping_path = mapping_dir / f'web_form_mapping_v{new_version}.json'
        with open(mapping_path, 'w') as f:
            json.dump(new_mapping, f, indent=2)
        print(f"Saved new mapping version {new_version} to {mapping_path}")
    else:
        print(f"Mapping unchanged, using version {latest_version}")
    
    # Create a temporary directory for the Vite project
    temp_dir = Path("temp_web_form")
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir()
    
    # Create package.json
    package_json = {
        "name": "data-dictionary-form",
        "private": True,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
        },
        "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "qrcode.react": "^3.1.0"
        },
        "devDependencies": {
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
            "@vitejs/plugin-react": "^4.0.0",
            "vite": "^5.0.0",
            "vite-plugin-singlefile": "^0.13.5"
        }
    }
    
    with open(temp_dir / "package.json", "w") as f:
        json.dump(package_json, f, indent=2)
    
    # Create vite.config.js with singlefile plugin
    vite_config = """
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
"""
    with open(temp_dir / "vite.config.js", "w") as f:
        f.write(vite_config)
    
    # Create index.html
    index_html = """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Data Dictionary Form</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""
    (temp_dir / "index.html").write_text(index_html)
    
    # Create src directory and copy our files
    src_dir = temp_dir / "src"
    src_dir.mkdir()
    shutil.copy("internal/src/web/App.jsx", src_dir / "App.jsx")
    shutil.copy("internal/src/web/App.css", src_dir / "App.css")
    
    # Copy raw file if it exists
    raw_file_path = Path("internal/src/web/logo.txt")
    if raw_file_path.exists():
        # Create a JavaScript file that exports the raw content
        raw_content = raw_file_path.read_text()
        raw_js = f"""
// This file contains the raw content of {raw_file_path.name}
export const rawContent = {json.dumps(raw_content)};
"""
        (src_dir / "raw-content.js").write_text(raw_js)
    
    # Create data.js
    data_js = f"""
// This file is automatically generated from the YAML data dictionary
export const data = {json.dumps(processed_data, indent=2)};
"""
    (src_dir / "data.js").write_text(data_js)
    
    # Create main.jsx
    main_jsx = """
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""
    (src_dir / "main.jsx").write_text(main_jsx)
    
    # Copy the latest mapping file as web_form_mapping.json
    if mapping_files:
        latest_file = mapping_files[-1]
        shutil.copy(latest_file, src_dir / "web_form_mapping.json")
    
    # Install dependencies and build
    subprocess.run(["npm", "install"], cwd=temp_dir, check=True)
    subprocess.run(["npm", "run", "build"], cwd=temp_dir, check=True)
    
    # Copy the built file to the output directory
    output_dir = Path("dist")
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    
    # Copy just the index.html file since it contains everything
    shutil.copy(temp_dir / "dist" / "index.html", output_dir / "web-form.html")
    
    # Clean up
    shutil.rmtree(temp_dir)
    
    print(f"Web form built successfully! Output is in {output_dir}/index.html")
    print("You can open index.html in your browser to view the form.")

if __name__ == "__main__":
    build_web_form() 