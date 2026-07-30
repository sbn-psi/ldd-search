import os
import subprocess
import shutil
from pathlib import Path
import json
import glob
from compile_model import load_model_dictionary

def load_yaml_data():
    return load_model_dictionary()

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
        elif assoc['reference_type'] in ('component_of', 'subclass_of'):
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

        if attr_data.get('examples'):
            attr_info['examples'] = attr_data['examples']
        
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
    examples = {}
    for attr in attr_list:
        attr_info = processed_data['attributes'][attr]
        if 'permissible_values' in attr_info:
            # Store sorted list for stable bitfield mapping
            permissible_values[attr] = sorted(attr_info['permissible_values'].keys())
        if 'examples' in attr_info:
            examples[attr] = sorted(attr_info['examples'].keys())
    mapping_changed = (
        not latest_mapping or
        latest_mapping['classes'] != class_list or
        latest_mapping['attributes'] != attr_list or
        latest_mapping.get('permissible_values', {}) != permissible_values or
        latest_mapping.get('examples', {}) != examples
    )
    new_version = latest_version + 1 if mapping_changed else latest_version
    new_mapping = {
        'version': new_version,
        'classes': class_list,
        'attributes': attr_list,
        'permissible_values': permissible_values,
        'examples': examples
    }

    # Only save if changed or no mapping exists
    if mapping_changed:
        mapping_path = mapping_dir / f'web_form_mapping_v{new_version}.json'
        with open(mapping_path, 'w') as f:
            json.dump(new_mapping, f, indent=2)
        print(f"Saved new mapping version {new_version} to {mapping_path}")
    else:
        print(f"Mapping unchanged, using version {latest_version}")
    
    # --- Write generated files directly to real src directory ---
    real_src_dir = Path("internal/src/web/template/src")

    # Write data.js
    data_js = f"""
// This file is automatically generated from the YAML data dictionary
export const data = {json.dumps(processed_data, indent=2)};
"""
    (real_src_dir / "data.js").write_text(data_js)

    # Write raw-content.js if logo.txt exists
    raw_file_path = Path("internal/src/web/logo.txt")
    if raw_file_path.exists():
        raw_content = raw_file_path.read_text()
        raw_js = f"""
// This file contains the raw content of {raw_file_path.name}
export const rawContent = {json.dumps(raw_content)};
"""
        (real_src_dir / "raw-content.js").write_text(raw_js)

    # Write web_form_mapping.json
    mapping_path = mapping_dir / f"web_form_mapping_v{new_version}.json"
    mapping_json_path = real_src_dir / "web_form_mapping.json"
    if mapping_path.exists():
        shutil.copy2(mapping_path, mapping_json_path)
        print(f"Copied {mapping_path} -> {mapping_json_path}")
    else:
        print(f"Warning: {mapping_path} not found, skipping web_form_mapping.json.")

    # --- Vite build in temp dir (for single-file output only) ---
    temp_dir = Path("temp_web_form")
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir()
    template_dir = Path("internal/src/web/template")
    shutil.copytree(template_dir, temp_dir, dirs_exist_ok=True, ignore=shutil.ignore_patterns('node_modules'))

    # Copy the latest mapping file as web_form_mapping.json in temp dir
    if mapping_path.exists():
        shutil.copy(mapping_path, temp_dir / "src" / "web_form_mapping.json")

    # Create data.js and raw-content.js in temp dir src (for build)
    (temp_dir / "src" / "data.js").write_text(data_js)
    if raw_file_path.exists():
        (temp_dir / "src" / "raw-content.js").write_text(raw_js)

    # Install dependencies and build
    subprocess.run(["npm", "ci"], cwd=temp_dir, check=True)
    subprocess.run(["npm", "run", "build"], cwd=temp_dir, check=True)

    # Copy the built file to the output directory
    output_dir = Path("dist")
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    shutil.copy(temp_dir / "dist" / "index.html", output_dir / "web-form.html")

    # Clean up
    shutil.rmtree(temp_dir)

    print(f"Web form built successfully! Output is in {output_dir}/web-form.html")
    print("You can open web-form.html in your browser to view the form.")

if __name__ == "__main__":
    build_web_form() 
