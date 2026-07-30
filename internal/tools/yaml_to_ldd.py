#!/usr/bin/env python3

import sys
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
from datetime import datetime
from compile_model import load_model_dictionary

def create_xml_element(parent, name, text=None, attributes=None):
    """Helper function to create XML elements with optional text and attributes."""
    # Replace 'n' with 'name' for element names
    if name == 'n':
        name = 'name'
    element = ET.SubElement(parent, name)
    if text is not None:
        # Convert boolean values to lowercase strings
        if isinstance(text, bool):
            element.text = str(text).lower()
        elif isinstance(text, datetime):
            element.text = text.strftime('%Y-%m-%dT%H:%M:%SZ')
        else:
            element.text = str(text)
    if attributes:
        for key, value in attributes.items():
            element.set(key, value)
    return element

def create_value_domain(parent, value_domain_data):
    """Create DD_Value_Domain element with its children."""
    value_domain = create_xml_element(parent, 'DD_Value_Domain')
    create_xml_element(value_domain, 'enumeration_flag', str(value_domain_data.get('enumeration_flag', 'false')).lower())
    create_xml_element(value_domain, 'value_data_type', value_domain_data.get('value_data_type', 'ASCII_Short_String_Collapsed'))
    create_xml_element(value_domain, 'unit_of_measure_type', value_domain_data.get('unit_of_measure_type', 'Units_of_None'))
    
    # Add permissible values if they exist
    if 'permissible_values' in value_domain_data:
        for value, meaning in value_domain_data['permissible_values'].items():
            perm_value = create_xml_element(value_domain, 'DD_Permissible_Value')
            create_xml_element(perm_value, 'value', value)
            create_xml_element(perm_value, 'value_meaning', meaning)

def create_attribute(parent, name, attr_data):
    """Create DD_Attribute element with its children."""
    attribute = create_xml_element(parent, 'DD_Attribute')
    create_xml_element(attribute, 'name', name)
    create_xml_element(attribute, 'version_id', attr_data.get('version_id', '1.0'))
    create_xml_element(attribute, 'local_identifier', attr_data.get('local_identifier', name))
    create_xml_element(attribute, 'nillable_flag', str(attr_data.get('nillable_flag', 'false')).lower())
    create_xml_element(attribute, 'submitter_name', attr_data.get('submitter_name', 'None'))
    create_xml_element(attribute, 'definition', attr_data.get('definition', ''))
    
    if 'value_domain' in attr_data:
        create_value_domain(attribute, attr_data['value_domain'])

def create_class(parent, name, class_data):
    """Create DD_Class element with its children."""
    class_elem = create_xml_element(parent, 'DD_Class')
    create_xml_element(class_elem, 'name', name)
    create_xml_element(class_elem, 'version_id', class_data.get('version_id', '1.0'))
    create_xml_element(class_elem, 'local_identifier', class_data.get('local_identifier', name))
    create_xml_element(class_elem, 'submitter_name', class_data.get('submitter_name', 'None'))
    create_xml_element(class_elem, 'definition', class_data.get('definition', ''))
    create_xml_element(class_elem, 'element_flag', str(class_data.get('element_flag', 'true')).lower())
    
    # Add associations
    if 'associations' in class_data:
        for assoc in class_data['associations']:
            association = create_xml_element(class_elem, 'DD_Association')
            create_xml_element(association, 'identifier_reference', assoc['identifier_reference'])
            create_xml_element(association, 'reference_type', assoc['reference_type'])
            create_xml_element(association, 'minimum_occurrences', assoc['minimum_occurrences'])
            # Convert \* to * in maximum_occurrences
            max_occ = assoc['maximum_occurrences']
            if max_occ == '\\*':
                max_occ = '*'
            create_xml_element(association, 'maximum_occurrences', max_occ)

def yaml_to_xml(yaml_data):
    """Convert YAML data to XML format."""
    # Create root element with namespaces
    root = ET.Element('Ingest_LDD', {
        'xmlns': 'http://pds.nasa.gov/pds4/pds/v1',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://pds.nasa.gov/pds4/pds/v1 https://pds.nasa.gov/pds4/pds/v1/PDS4_PDS_1E00.xsd'
    })
    
    # Add header elements
    create_xml_element(root, 'name', yaml_data.get('name', ''))
    create_xml_element(root, 'ldd_version_id', yaml_data.get('ldd_version_id', '1.0.0.0'))
    create_xml_element(root, 'dictionary_type', yaml_data.get('dictionary_type', 'Discipline'))
    create_xml_element(root, 'full_name', yaml_data.get('full_name', ''))
    create_xml_element(root, 'steward_id', yaml_data.get('steward_id', ''))
    create_xml_element(root, 'namespace_id', yaml_data.get('namespace_id', ''))
    create_xml_element(root, 'last_modification_date_time', yaml_data.get('last_modification_date_time', ''))
    
    # Add attributes
    if 'attributes' in yaml_data:
        for attr_name, attr_data in yaml_data['attributes'].items():
            create_attribute(root, attr_name, attr_data)
    
    # Add classes
    if 'classes' in yaml_data:
        for class_name, class_data in yaml_data['classes'].items():
            create_class(root, class_name, class_data)
    
    return root

def prettify_xml(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    
    # Add XML declaration and schema reference
    xml_declaration = '<?xml version="1.0" encoding="UTF-8"?>\n'
    schema_ref = '<?xml-model href="https://pds.nasa.gov/pds4/pds/v1/PDS4_PDS_1E00.sch" schematypens="http://purl.oclc.org/dsdl/schematron"?>\n'
    
    # Get XML string and fix element names
    xml_str = reparsed.toprettyxml(indent='  ')[len('<?xml version="1.0" ?>\n'):]
    xml_str = xml_str.replace('<n>', '<name>')
    xml_str = xml_str.replace('</n>', '</name>')
    xml_str = xml_str.replace('<n/>', '<name/>')
    xml_str = xml_str.replace('<n ', '<name ')
    xml_str = xml_str.replace('</n\n', '</name\n')
    xml_str = xml_str.replace('<n\n', '<name\n')
    xml_str = xml_str.replace('<n>', '<name>')
    xml_str = xml_str.replace('</n>', '</name>')
    
    return xml_declaration + schema_ref + xml_str

def main():
    if len(sys.argv) != 2:
        print("Usage: python yaml_to_ldd.py output.xml")
        sys.exit(1)

    output_file = sys.argv[1]
    yaml_data = load_model_dictionary()

    # Convert to XML
    root = yaml_to_xml(yaml_data)
    
    # Get XML string and fix element names
    xml_str = prettify_xml(root)
    
    # Write fixed XML to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_str)

if __name__ == '__main__':
    main() 
