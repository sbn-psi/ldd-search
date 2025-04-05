import yaml
import collections

def load_yaml(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def save_yaml(data, file_path):
    # Convert OrderedDict to regular dict before saving
    def convert_ordered_dict(obj):
        if isinstance(obj, collections.OrderedDict):
            return dict(obj)
        elif isinstance(obj, dict):
            return {k: convert_ordered_dict(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_ordered_dict(i) for i in obj]
        else:
            return obj
    
    data_to_save = convert_ordered_dict(data)
    with open(file_path, 'w') as file:
        yaml.dump(data_to_save, file, default_flow_style=False, sort_keys=False)

def transform_model_to_dictionary(model):
    data_dictionary = {
        'name': 'Search',
        'ldd_version_id': '1.0.0.0',
        'dictionary_type': 'Discipline',
        'full_name': 'Drum, Mike',
        'steward_id': 'drum',
        'namespace_id': 'search',
        'last_modification_date_time': '2030-04-10T18:00:00Z',
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
                    # Keep track of class order
                    class_order.append(key)
                    
                    class_info = {
                        'version_id': '1.0',
                        'local_identifier': key,
                        'submitter_name': 'Mike Drum',
                        'definition': value.get('definition', ''),
                        'element_flag': is_top_level,
                        'associations': []
                    }
                    
                    # Record parent-child relationship for later
                    if parent_class:
                        if parent_class not in parent_child_map:
                            parent_child_map[parent_class] = []
                        parent_child_map[parent_class].append(key)
                    
                    data_dictionary['classes'][key] = class_info
                    
                    # Store children for later association processing
                    class_children[key] = []
                    
                    # Process children, getting their keys
                    for child in value['children']:
                        for child_key in child.keys():
                            class_children[key].append(child_key)
                    
                    # Process children recursively
                    extract_elements(value['children'], key, False)
                elif value is not None and isinstance(value, dict):
                    # It's an attribute
                    attribute_info = {
                        'version_id': '1.0',
                        'local_identifier': key,
                        'nillable_flag': False,
                        'submitter_name': 'Mike Drum',
                        'definition': value.get('definition', ''),
                        'value_domain': {
                            'enumeration_flag': 'values' in value,
                            'value_data_type': 'ASCII_Short_String_Collapsed',
                            'unit_of_measure_type': 'Units_of_None'
                        }
                    }
                    if 'values' in value and isinstance(value['values'], dict):
                        attribute_info['value_domain']['permissible_values'] = value['values']
                    data_dictionary['attributes'][key] = attribute_info
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
                        'maximum_occurrences': 1
                    })
        
        # Add parent-child associations (parent references its child classes)
        for parent_class, child_classes in parent_child_map.items():
            for child_class in child_classes:
                if child_class in data_dictionary['classes']:
                    data_dictionary['classes'][parent_class]['associations'].append({
                        'identifier_reference': child_class,
                        'reference_type': 'subclass_of',
                        'minimum_occurrences': 0,
                        'maximum_occurrences': 1
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

# Load the model YAML
model_yaml_path = 'internal/src/search-ldd-model.yaml'
model_data = load_yaml(model_yaml_path)

# Transform the model to data dictionary
data_dictionary = transform_model_to_dictionary(model_data)

# Save the data dictionary YAML
data_dictionary_yaml_path = 'internal/src/data_dictionary.yaml'
save_yaml(data_dictionary, data_dictionary_yaml_path)