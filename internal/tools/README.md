# Data Dictionary Form Tools

This directory contains tools for generating forms based on the data dictionary.

## PDF Form Generator

The PDF form generator creates a printable form with checkboxes and text fields for filling out the data dictionary.

### Requirements
- Python 3.6+
- reportlab
- pyyaml

### Installation
```bash
pip install reportlab pyyaml
```

### Usage
```bash
python generate_pdf_form.py
```

This will generate a `data_dictionary_form.pdf` file in the current directory.

## Web Form Builder

The web form builder creates a static HTML version of the form that can be opened in any web browser.

### Requirements
- Python 3.6+
- Node.js and npm

### Usage
```bash
python build_web_form.py
```

This will:
1. Create a temporary Vite project
2. Build the React app into static files
3. Output the built files to `internal/src/web/dist`

You can then open `internal/src/web/dist/index.html` in any web browser to use the form.

## Form Features

Both forms include:
- Checkboxes for selecting which classes and attributes to include
- Radio buttons for enumerated values
- Text fields for non-enumerated values
- "Other" option with text field for custom values
- Descriptions for classes and attributes

The web form additionally provides:
- Interactive selection of classes and attributes
- Real-time validation
- Modern, responsive UI 