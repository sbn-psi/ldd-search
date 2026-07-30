# Search Dictionary User's Guide

## Introduction

### Purpose of this User's Guide

This guide explains what the Search (`search:`) discipline dictionary is for,
where its classes belong in a PDS4 label, and how to choose values for them. It
is written for data providers and node personnel preparing bundle and collection
labels. It is not a tutorial on PDS4 labels in general.

### Audience

Anyone writing or reviewing a `Product_Bundle` or `Product_Collection` label who
wants that data set to be discoverable by scientists who have never heard of it.
No familiarity with local data dictionary development is assumed.

### Applicable documents

- [PDS4 Standards Reference and Information Model](https://pds.nasa.gov/datastandards/documents/)
- The class and attribute reference in this documentation set
- The interactive [Search LDD form](../search-form.rst), which turns the same
  model into a fill-in-the-blanks questionnaire

## Overview

### What this dictionary is for

The Search dictionary describes a data set the way a person would describe it in
conversation: this is spectroscopy of main belt asteroids; this is a global
thermal map of Mars; this is a laboratory study of silicate composition. Those
statements are obvious to whoever built the archive and nearly invisible to
anyone searching it. This dictionary is where they get written down in a place a
search tool can read.

It deliberately does not attempt to be precise. Nothing in it is intended to be
used for scientific calculation, and none of it substitutes for the specific
discipline dictionaries — geometry, imaging, spectral, and the rest — that
describe the data properly. Think of it as the index at the back of the book.

### What kinds of products use it

Bundles and collections. The dictionary summarizes a data set, and a bundle or a
collection is what a data set looks like in PDS4. A collection of
laboratory spectra and a collection of derived shape models within the same
bundle will usually want different keywords, which is exactly why the
collection level is worth filling in rather than relying on the bundle alone.

Applying these classes to individual observational products is permitted by the
schema but not recommended. It multiplies identical keywords across every
product in a collection, which makes labels larger without making the archive
more findable.

### Stewardship

The dictionary is stewarded by Mike Drum at the Small Bodies Node. Questions,
corrections, and — especially — requests to add a keyword to one of the
suggested vocabularies should be raised through the
[PDS4 Issue Repo](https://github.com/pds-data-dictionaries/PDS4-LDD-Issue-Repo/issues/new/choose)
under the `ldd-search` update request block.

## How the dictionary is organized

The dictionary has four top-level classes, each answering a different question
about the data set. They are independent: use as many or as few as apply.

| Class | Question it answers |
| --- | --- |
| `search:Scientific_Discipline` | What field of science is this, and how was it studied? |
| `search:Target_Object` | What was observed, and what kind of thing is it? |
| `search:Data_Collection` | How were the data gathered, and what form are they in? |
| `search:Research_Context` | Who did this, why, and with what tools? |

Two of them nest further. `search:Target_Object` contains
`search:Object_Type` — which in turn holds `search:Small_Body`,
`search:Atmosphere`, and `search:Rings` — along with `search:Feature`,
`search:Physical_Properties`, and `search:Environmental_Context`.
`search:Data_Collection` contains `search:Temporal_Epoch`, and
`search:Research_Context` contains `search:Software_Used`.

The nesting exists so that narrow vocabularies stay attached to the thing they
describe: `search:ring_division` only makes sense inside `search:Rings`, and
`search:mars_geologic_epoch` only inside `search:Temporal_Epoch`. The complete
hierarchy, with every attribute and its suggested values, is in the class and
attribute reference.

## Filling in the keywords

### Everything is optional, repeatable, and free text

All fifty-two attributes have cardinality 0..\*, so an attribute may be omitted,
given once, or given many times. All of them are
`ASCII_Short_String_Collapsed` with no schema-enforced enumeration. The
vocabularies in the reference are suggestions, and a value outside them is valid
in a label.

This design is intentional. Locking the vocabulary would mean a label author
either waits for a dictionary release or writes something inaccurate. Leaving it
open means a value can always be recorded honestly, and recurring custom values
become the evidence for adding them to the suggested list later.

Repeating an attribute is normal and expected:

```xml
<search:Scientific_Discipline>
    <search:study_focus>Composition</search:study_focus>
    <search:study_focus>Surface</search:study_focus>
    <search:scientific_field>Astronomy_Spectroscopy</search:scientific_field>
    <search:investigation_technique>Spectroscopy</search:investigation_technique>
    <search:investigation_technique>Ground based observation</search:investigation_technique>
</search:Scientific_Discipline>
```

### Choosing values well

A few habits make the difference between keywords that help and keywords that
get ignored:

- **Prefer a suggested value when one fits.** The whole point is that two
  archives describing the same kind of data land on the same word. Reach for a
  custom value when the suggested list genuinely has no equivalent, not when the
  wording is slightly different from what you would have chosen.
- **Describe the data set, not the mission.** A collection of calibration files
  from an imaging mission is not usefully described as surface geology. Ask what
  a person would actually be looking for when they find *this* collection.
- **Omit rather than guess.** A blank attribute costs nothing. A wrong one
  surfaces the data set in searches it does not belong in, which is worse for
  everyone than not being found.
- **Do not use these fields as identifiers.** `search:object_name` is a keyword
  for people, not a resolvable reference; `Target_Identification` and the
  context products remain the authoritative statement of what was observed.
- **Match granularity to the label.** Bundle-level keywords should be true of
  everything inside the bundle. If a keyword only applies to one collection, it
  belongs on that collection.

### Using the form

The [Search LDD form](../search-form.rst) presents the same model as a
questionnaire, with every definition and suggested value inline. It runs
entirely in the browser and stores nothing — your selections are encoded into
the page URL, so you can bookmark a partly-filled form, send the link to a
colleague, or scan the QR code to move it to another machine.

For most label authors this is the easiest path: work through the form, then
transcribe the selections into the label.

Treat those links as working state, not as a record. A saved URL is decoded
against whatever vocabulary the form currently ships with, so a link kept across
a dictionary update may come back showing different selections than the ones you
saved. Transcribe into the label — the label is the durable copy.

## Putting it in a label

The classes go inside `Discipline_Area`, within `Context_Area`. Bundle and
collection labels use `Context_Area` where an observational product would use
`Observation_Area` — this is another reason the dictionary belongs at the data
set level rather than on individual products. Declare the namespace and add its
schema to `xsi:schemaLocation` alongside the core PDS4 schema.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Product_Bundle
    xmlns="http://pds.nasa.gov/pds4/pds/v1"
    xmlns:search="http://pds.nasa.gov/pds4/search/v1"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pds.nasa.gov/pds4/pds/v1
                        https://pds.nasa.gov/pds4/pds/v1/PDS4_PDS_1L00.xsd
                        http://pds.nasa.gov/pds4/search/v1
                        https://pds.nasa.gov/pds4/search/v1/PDS4_SEARCH_1L00_1000.xsd">
  <Identification_Area>
    <!-- ... -->
  </Identification_Area>
  <Context_Area>
    <Discipline_Area>
      <search:Scientific_Discipline>
        <search:study_focus>Surface</search:study_focus>
        <search:scientific_field>Geology_Surface</search:scientific_field>
        <search:investigation_technique>Remote Sensing</search:investigation_technique>
      </search:Scientific_Discipline>
      <search:Target_Object>
        <search:object_name>(101955) Bennu</search:object_name>
        <search:target_scope>Global</search:target_scope>
        <search:Object_Type>
          <search:Small_Body>
            <search:asteroid_type>Near_Earth</search:asteroid_type>
          </search:Small_Body>
        </search:Object_Type>
        <search:Physical_Properties>
          <search:material_type>Regolith</search:material_type>
          <search:composition_type>Organic</search:composition_type>
        </search:Physical_Properties>
      </search:Target_Object>
      <search:Data_Collection>
        <search:collection_method>Orbiter</search:collection_method>
        <search:instrument_type>Imager</search:instrument_type>
        <search:data_category>Map</search:data_category>
        <search:data_format>Mosaic</search:data_format>
      </search:Data_Collection>
      <search:Research_Context>
        <search:research_goals>Global characterization of the Bennu surface</search:research_goals>
        <search:keywords>regolith</search:keywords>
        <search:keywords>boulder distribution</search:keywords>
        <search:Software_Used>
          <search:data_visualization_software>SBMT</search:data_visualization_software>
        </search:Software_Used>
      </search:Research_Context>
    </Discipline_Area>
  </Context_Area>
  <!-- ... -->
</Product_Bundle>
```

Substitute the schema version matching your label's information model version.
The Search schema file name encodes both the information model version and the
dictionary version — `PDS4_SEARCH_1L00_1000` is Search 1.0.0.0 built against
information model 1.21.0.0.

Order matters: within a class, attributes and nested classes must appear in the
order given in the reference, and repeated values of one attribute must be
adjacent. This is ordinary PDS4 sequence validation, and running Validate will
catch it.

## Definitions

The complete reference — every class and attribute, its definition, and its
suggested values, in label order — is in the class and attribute reference
section of this documentation.
