import yaml
import collections
import re
from pathlib import Path

MODEL_YAML_PATH = Path(__file__).parent.parent / 'src' / 'search-ldd-model.yaml'

def load_yaml(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def normalize_attribute_name(name):
    """Convert user-facing facet names to stable PDS-style attribute names."""
    normalized = name.strip().replace('&', ' and ')
    normalized = re.sub(r'[^0-9A-Za-z]+', '_', normalized)
    normalized = re.sub(r'_+', '_', normalized).strip('_').lower()
    return normalized

def normalize_class_name(name):
    """Convert class-like YAML keys to stable PDS-style class names."""
    normalized = name.strip().replace('&', ' and ')
    normalized = re.sub(r'[^0-9A-Za-z]+', '_', normalized)
    normalized = re.sub(r'_+', '_', normalized).strip('_')
    return normalized

def example_values(value):
    if isinstance(value, dict):
        return value
    if isinstance(value, list):
        return {str(item): '' for item in value}
    return {}

def transform_model_to_dictionary(model):
    data_dictionary = {
        'name': 'Search',
        'ldd_version_id': '1.0.0.0',
        'dictionary_type': 'Discipline',
        'full_name': 'Drum, Mike',
        'steward_id': 'drum',
        'namespace_id': 'search',
        'last_modification_date_time': '2026-06-17T00:00:00Z',
        'attributes': {},
        'classes': collections.OrderedDict()
    }
    
    # Store class-attribute relationships for building associations
    class_children = {}
    
    # Store parent-child relationships
    parent_child_map = {}
    
    # Keep track of class order
    class_order = []
    
    # First pass: extract all classes and attributes
    def extract_elements(element, parent_class=None, is_top_level=True):
        if isinstance(element, dict):
            for key, value in element.items():
                if value is not None and isinstance(value, dict) and 'children' in value and isinstance(value['children'], list):
                    # It's a class
                    class_name = normalize_class_name(key)

                    # Keep track of class order
                    class_order.append(class_name)
                    
                    class_info = {
                        'version_id': '1.0',
                        'local_identifier': class_name,
                        'submitter_name': 'Mike Drum',
                        'definition': value.get('definition', ''),
                        'element_flag': is_top_level,
                        'associations': []
                    }
                    
                    # Record parent-child relationship for later
                    if parent_class:
                        if parent_class not in parent_child_map:
                            parent_child_map[parent_class] = []
                        parent_child_map[parent_class].append(class_name)
                    
                    data_dictionary['classes'][class_name] = class_info
                    
                    # Store children for later association processing
                    class_children[class_name] = []
                    
                    # Process children, getting their keys
                    for child in value['children']:
                        for child_key in child.keys():
                            child_value = child[child_key]
                            if isinstance(child_value, dict) and 'children' in child_value:
                                class_children[class_name].append(normalize_class_name(child_key))
                            else:
                                class_children[class_name].append(normalize_attribute_name(child_key))
                    
                    # Process children recursively
                    extract_elements(value['children'], class_name, False)
                elif value is not None and isinstance(value, dict):
                    # It's an attribute
                    attr_name = normalize_attribute_name(key)
                    examples = example_values(value.get('examples', value.get('values', {})))
                    fixed_values = bool(value.get('fixed_values', False))
                    attribute_info = {
                        'version_id': '1.0',
                        'local_identifier': attr_name,
                        'nillable_flag': False,
                        'submitter_name': 'Mike Drum',
                        'definition': value.get('definition', ''),
                        'value_domain': {
                            'enumeration_flag': fixed_values,
                            'value_data_type': 'ASCII_Short_String_Collapsed',
                            'unit_of_measure_type': 'Units_of_None'
                        }
                    }
                    if examples:
                        attribute_info['examples'] = examples
                    if fixed_values and examples:
                        attribute_info['value_domain']['permissible_values'] = examples
                    data_dictionary['attributes'][attr_name] = attribute_info
                else:
                    print(f"Error: Expected a dictionary for '{key}', but got {type(value).__name__} instead.")
        elif isinstance(element, list):
            for item in element:
                if isinstance(item, dict):
                    extract_elements(item, parent_class, is_top_level)
                else:
                    print(f"Error: Expected a dictionary in list, but got {type(item).__name__} instead.")
    
    # Second pass: add associations
    def add_associations():
        # Add attribute_of associations
        for class_name, child_keys in class_children.items():
            for child_key in child_keys:
                if child_key in data_dictionary['attributes']:
                    # It's an attribute, add attribute_of association
                    data_dictionary['classes'][class_name]['associations'].append({
                        'identifier_reference': child_key,
                        'reference_type': 'attribute_of',
                        'minimum_occurrences': 0,
                        'maximum_occurrences': '\\*'
                    })
        
        # Add parent-child associations (parent references its child classes)
        for parent_class, child_classes in parent_child_map.items():
            for child_class in child_classes:
                if child_class in data_dictionary['classes']:
                    data_dictionary['classes'][parent_class]['associations'].append({
                        'identifier_reference': child_class,
                        'reference_type': 'component_of',
                        'minimum_occurrences': 0,
                        'maximum_occurrences': '\\*'
                    })
    
    # Execute both passes
    extract_elements(model)
    add_associations()
    
    # Reorder classes based on their appearance in the original model
    ordered_classes = collections.OrderedDict()
    for class_name in class_order:
        if class_name in data_dictionary['classes']:
            ordered_classes[class_name] = data_dictionary['classes'][class_name]
    
    # Make sure all classes are included
    for class_name in data_dictionary['classes']:
        if class_name not in ordered_classes:
            ordered_classes[class_name] = data_dictionary['classes'][class_name]
    
    data_dictionary['classes'] = ordered_classes
    
    return data_dictionary

def load_model_dictionary(model_yaml_path=MODEL_YAML_PATH):
    return transform_model_to_dictionary(load_yaml(model_yaml_path))
