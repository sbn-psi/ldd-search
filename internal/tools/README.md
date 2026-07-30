# Search LDD Tooling

Everything the Search dictionary publishes is generated from one authored
source: [`internal/src/search-ldd-model.yaml`](../src/search-ldd-model.yaml).
The tools here read that model and emit the IngestLDD, the interactive web form,
the printable PDF form, and the schemas needed to validate labels against older
information model versions.

`compile_model.py` is the shared front end. It loads the YAML, walks the
recursive class/attribute tree, normalizes names into PDS style (`Study_Focus`
becomes the `study_focus` attribute), and returns a dictionary of classes,
attributes, and associations. Every other tool starts from
`load_model_dictionary()`, which is what keeps the IngestLDD and the forms
describing the same dictionary.

## IngestLDD Generator

Rewrites the managed IngestLDD from the model. Run it after any change to the
YAML, and commit the result — PDS build automation reads the XML from `src/`,
not the YAML.

```bash
python internal/tools/yaml_to_ldd.py src/PDS4_Search_IngestLDD.xml
```

Every attribute is emitted as a non-enumerated
`ASCII_Short_String_Collapsed` with cardinality 0..\*. The `examples` block in
the YAML supplies suggested values for the forms and the documentation; it is
deliberately *not* emitted as `DD_Permissible_Value`, so label authors are never
blocked on a dictionary release to record something true.

## Schema Builder

Builds the Search namespace schemas for the PDS4 information model versions used
by real archive labels, so that existing bundles and collections can be
validated without being migrated first.

```bash
python internal/tools/build_search_ldd_schemas.py
```

## Web Form Builder

Writes the compiled model to `internal/src/web/template/src/data.js`, builds the
React/Vite app there, and emits a single self-contained HTML file.

### Requirements
- Python 3.6+
- Node.js and npm

### Usage
```bash
python internal/tools/build_web_form.py
```

The output is `dist/web-form.html` — one file, no server, openable from disk.
The docs build copies it to `web-form/index.html` on the documentation site, and
`docs/Makefile`'s `github` target asserts that it exists before running Sphinx.

### The mapping files

Form selections are shared through the URL. Instead of serializing names, the
form encodes them as bitfields indexed against a mapping file,
`internal/src/web/web_form_mapping_vN.json`, which pins the sorted order of every
class, attribute, and example value. The bitfield is compressed with `lz-string`
and rendered as both a copyable link and a QR code.

The builder compares the freshly compiled model against the newest mapping and
writes a new version only when the vocabulary actually changed.

**The versioning is not yet enforced at decode time.** `compressState` writes the
mapping version into the payload as `ver`, but `expandCompressedState` never
reads it, and the app bundles only the current `web_form_mapping.json`. A URL
produced under an older mapping is decoded against today's index order; if the
order shifted, it resolves to the wrong values silently. Making the decoder
branch on `ver` — which means bundling the older mappings too — is the
outstanding fix. Until then, do not delete the older
`web_form_mapping_vN.json` files: they are the only record of the earlier index
orders, and that fix is not possible without them.

## PDF Form Generator

A printable worksheet, for workshops, interviews, and anywhere a browser is the
wrong tool. It walks the class hierarchy, printing each class header and each
attribute with its definition and a blank write-in field.

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
python internal/tools/generate_pdf_form.py
```

This writes `data_dictionary_form.pdf` in the repository root.

The generator prints checkboxes only for attributes whose `enumeration_flag` is
true. Since this dictionary has none by design, every attribute currently prints
as a write-in field and **the suggested vocabularies do not appear in the PDF at
all** — `generate_pdf_form.py` reads `value_domain.permissible_values` and never
looks at the model's `examples`. Anyone working from the printed form needs the
reference documentation alongside it. Teaching `draw_attribute` to fall back to
`examples` when there are no permissible values would close the gap; `draw_radio`
is likewise defined but never called.

## What each form offers

The web form:
- Interactive selection of classes and attributes, following the nesting of the
  model
- Suggested values offered as selectable options, with their meanings inline
- Free-text entry for values outside the suggested vocabulary
- Definitions for every class and attribute, inline
- A review page summarizing the selections
- Shareable URL and QR code for resuming or handing off a partly-filled form
  (see the version caveat above)

The PDF form:
- The full class hierarchy, indented by nesting level
- Definitions for every class and attribute, inline
- A write-in field per attribute
