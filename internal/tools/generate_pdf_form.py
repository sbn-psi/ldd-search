from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from compile_model import load_model_dictionary

def load_yaml_data():
    return load_model_dictionary()

def validate_yaml_data(data):
    """Validate the YAML data structure and references."""
    errors = []
    
    # Check that all classes exist
    class_names = set(data['classes'].keys())
    
    # Check that all attributes exist
    attribute_names = set(data['attributes'].keys())
    
    # Validate class associations
    for class_name, class_data in data['classes'].items():
        for assoc in class_data['associations']:
            ref_type = assoc['reference_type']
            ref_name = assoc['identifier_reference']
            
            if ref_type == 'attribute_of':
                if ref_name not in attribute_names:
                    errors.append(f"Class '{class_name}' references non-existent attribute '{ref_name}'")
            elif ref_type in ('component_of', 'subclass_of'):
                if ref_name not in class_names:
                    errors.append(f"Class '{class_name}' references non-existent nested class '{ref_name}'")
    
    # Validate attribute value domains
    for attr_name, attr_data in data['attributes'].items():
        value_domain = attr_data['value_domain']
        if value_domain.get('enumeration_flag', False):
            if 'permissible_values' not in value_domain:
                errors.append(f"Attribute '{attr_name}' has enumeration_flag=True but no permissible_values")
    
    if errors:
        raise ValueError("YAML validation errors:\n" + "\n".join(errors))

def draw_checkbox(c, x, y, size=0.15*inch):
    c.setLineWidth(1)
    c.rect(x, y - size/4, size, size, stroke=1, fill=0)
    c.setLineWidth(1)

def draw_radio(c, x, y, size=0.25*inch):
    c.setLineWidth(1)
    c.circle(x + size/2, y + size/4, size/2, stroke=1, fill=0)
    c.setLineWidth(1)

def draw_text_field(c, x, y, width=2, height=0.2):
    c.setLineWidth(1)
    c.rect(x, y, width, height, stroke=1, fill=0)
    c.setLineWidth(1)

def draw_box(c, x, y, width, height):
    c.rect(x, y, width, height)

def draw_line(c, x, y, width, stroke_width=1):
    c.setLineWidth(stroke_width)
    c.line(x, y, x + width, y)
    c.setLineWidth(1)

def check_margins(c, y, required_height):
    """Check if we have enough space on the current page."""
    bottom_margin = 0.5*inch  # Reduced from 1 inch
    if y - required_height < bottom_margin:
        c.showPage()
        return 10*inch  # Return to top of new page
    return y

def get_text_width(c, text, font_name, font_size):
    """Get the width of text in points."""
    c.setFont(font_name, font_size)
    return c.stringWidth(text, font_name, font_size)

def format_display_name(name):
    """Replace underscores with spaces in display names."""
    return name.replace('_', ' ')

def draw_class_header(c, y, class_name, description, indent_level=0):
    # Check if we have enough space
    required_height = 0.6*inch
    y = check_margins(c, y, required_height)
    
    # Calculate indentation based on level
    indent = 1*inch + (indent_level * 0.5*inch)
    
    # Draw class name and description on same line
    y -= 0.15*inch
    c.setFont("Helvetica-Bold", 12)
    display_name = format_display_name(class_name)
    class_width = get_text_width(c, display_name, "Helvetica-Bold", 12)
    c.drawString(indent, y, display_name)
    
    # Check if description will fit on the same line
    desc_width = get_text_width(c, f"{description}", "Helvetica", 10)
    if class_width + desc_width + 0.2*inch < 6.5*inch - indent:
        c.setFont("Helvetica", 10)
        c.drawString(indent + class_width + 0.2*inch, y, description)
    else:
        y -= 0.15*inch
        c.setFont("Helvetica", 10)
        c.drawString(indent, y, description)
    
    # Add separator space
    y -= 0.2*inch
    
    return y - 0.15*inch

def draw_attribute(c, y, attr_name, attr_data, is_enum, indent_level=0):
    # Check if we have enough space
    required_height = 0.8*inch if not is_enum else 1.2*inch
    y = check_margins(c, y, required_height)
    
    # Calculate indentation based on level
    indent = 1.5*inch + (indent_level * 0.5*inch)
    
    # Draw attribute name and description on same line (indented)
    c.setFont("Helvetica-Bold", 10)
    display_name = format_display_name(attr_name)
    attr_width = get_text_width(c, display_name, "Helvetica-Bold", 10)
    c.drawString(indent, y, display_name)
    
    # Check if description will fit on the same line
    desc_width = get_text_width(c, attr_data['definition'], "Helvetica", 9)
    if attr_width + desc_width + 0.2*inch < 7.5*inch - indent:
        c.setFont("Helvetica", 9)
        c.drawString(indent + attr_width + 0.2*inch, y, attr_data['definition'])
    else:
        y -= 0.15*inch
        c.setFont("Helvetica", 9)
        c.drawString(indent, y, attr_data['definition'])
    
    if is_enum:
        y -= 0.2*inch
        
        for value, description in attr_data['value_domain']['permissible_values'].items():
            # Check if we have enough space for this value
            y = check_margins(c, y, 0.2*inch)
            
            draw_checkbox(c, indent, y)
            
            # Draw value name in bold
            c.setFont("Helvetica-Bold", 9)
            display_value = format_display_name(value)
            value_width = get_text_width(c, display_value, "Helvetica-Bold", 9)
            c.drawString(indent + 0.25*inch, y, display_value)
            
            # Draw description in regular font
            c.setFont("Helvetica", 9)
            c.drawString(indent + 0.25*inch + value_width + 0.1*inch, y, description)
            
            y -= 0.2*inch
        
    else:
        y -= 0.3*inch
        c.drawString(indent, y, "Value:")
        draw_text_field(c, indent + 0.8*inch, y, 3*inch)
        y -= 0.2*inch
    
    # Draw separator line between attributes (lighter)
    draw_line(c, indent, y, 7.5*inch - indent, stroke_width=0.5)
    y -= 0.15*inch
    
    return y

def get_class_hierarchy(data, class_name, hierarchy=None):
    """Get the hierarchy of classes including nested classes."""
    if hierarchy is None:
        hierarchy = {}
    
    class_data = data['classes'][class_name]
    attributes = []
    nested_classes = {}
    
    for assoc in class_data['associations']:
        if assoc['reference_type'] == 'attribute_of':
            attributes.append(assoc['identifier_reference'])
        elif assoc['reference_type'] in ('component_of', 'subclass_of'):
            subclass_name = assoc['identifier_reference']
            nested_classes[subclass_name] = {}
            get_class_hierarchy(data, subclass_name, nested_classes[subclass_name])
    
    hierarchy['attributes'] = attributes
    hierarchy['nested_classes'] = nested_classes
    return hierarchy

def process_class_with_nested(c, data, class_name, y, indent_level=0):
    """Process a class and its nested classes recursively."""
    class_data = data['classes'][class_name]
    
    # Draw class header with proper indentation
    y = draw_class_header(c, y, class_name, class_data['definition'], indent_level)
    
    # Get class hierarchy
    hierarchy = {}
    get_class_hierarchy(data, class_name, hierarchy)
    
    # Process attributes directly belonging to this class
    for attr_name in hierarchy['attributes']:
        if attr_name in data['attributes']:
            attr_data = data['attributes'][attr_name]
            is_enum = attr_data['value_domain'].get('enumeration_flag', False)
            
            y = draw_attribute(c, y, attr_name, attr_data, is_enum, indent_level)
    
    # Process nested classes
    for subclass_name, subclass_hierarchy in hierarchy['nested_classes'].items():
        y = process_class_with_nested(c, data, subclass_name, y, indent_level + 1)
    
    return y

def generate_pdf_form():
    data = load_yaml_data()
    validate_yaml_data(data)
    
    c = canvas.Canvas("data_dictionary_form.pdf", pagesize=letter)
    
    # Set up initial position
    y = 10*inch
    
    # Draw title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(1*inch, y, "PDS Search LDD Form")
    y -= 0.3*inch  # Reduced from 0.5 inch
    
    # Draw separator line after title
    draw_line(c, 1*inch, y, 6.5*inch, stroke_width=1.5)
    y -= 0.15*inch  # Reduced from 0.3 inch
    
    # Process each top-level class
    for class_name, class_data in data['classes'].items():
        if class_data.get('element_flag', True):  # Only process top-level classes
            # Process the class and its nested classes recursively
            y = process_class_with_nested(c, data, class_name, y)
            
            # Draw separator line between classes (thicker)
            draw_line(c, 1*inch, y, 6.5*inch, stroke_width=1.5)
            y -= 0.15*inch
    
    c.save()

if __name__ == "__main__":
    generate_pdf_form()
