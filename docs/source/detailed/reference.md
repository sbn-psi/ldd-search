# Class and Attribute Reference

This is the complete contents of the Search (`search:`) dictionary, in the order
classes and attributes must appear in a label.

Rules that apply to everything below, and are therefore not repeated in each
entry:

- **Data type** is `ASCII_Short_String_Collapsed` for every attribute.
- **Cardinality** is 0..\* for every attribute and nested class. Nothing is
  required; anything may be repeated.
- **Values are suggestions.** No attribute is a schema-enforced enumeration. The
  values listed here are the shared vocabulary the dictionary recommends, and a
  value outside the list is still valid in a label. Repeated custom values are
  the best argument for extending the list — please report them.
- **Nillable:** no. Omit an attribute rather than nilling it.

---

## `search:Scientific_Discipline`

*Information about the scientific discipline and research context.* What field
of science this data set belongs to and how the science was done.

### `search:study_focus`

High-level research focus.

> Surface · Interior · Atmosphere · Magnetosphere · Orbital_Dynamics ·
> Composition · Plasma · Space Weather · Planetary Protection · Rings · Resources

### `search:scientific_field`

The scientific field of study.

> Astrobiology · Astronomy_Observation · Astronomy_Radar · Astronomy_Exoplanets ·
> Astronomy_Spectroscopy · Biology · Chemistry · Geology_Geophysics ·
> Geology_Seismology · Geology_Surface · Geology_Crater_Counting ·
> Geology_Interior_Studies · Dynamics · Mathematics · Laboratory_Geochemistry ·
> Laboratory_Cosmochemistry · Laboratory_Age_Dating ·
> Laboratory_Analytic_Chemistry · Laboratory_Spectral_Analysis ·
> Atmospheric_Study · Impact · Hydrology · Exoplanets · Modeling ·
> Magnetospheres · Physics · Space_Physics

### `search:investigation_technique`

The method of scientific investigation used.

> Spectroscopy · Modeling · Mapping · Radar · Seismology ·
> Ground based observation · Gravimetry · Remote Sensing · LiDAR · Geochemistry ·
> Laboratory · Data analysis · Artificial Intelligence · ICPMS

---

## `search:Target_Object`

*Information about the target of observation, whether it is a celestial body,
feature, or other object.* This is the largest branch of the dictionary. Only
the parts that apply need to be filled in — a laboratory study of meteorite
samples may use `search:Physical_Properties` and nothing else.

These keywords are for human search. They do not replace
`Target_Identification` or the PDS context products, which remain the
authoritative identification of what was observed.

### `search:object_name`

Name of the object. Free text — use the name a searcher would type, in whatever
form is conventional for the object.

### `search:parent_body`

Parent body of the object. Useful for satellites, ring systems, and features:
a study of Enceladus plumes has a parent body of Saturn.

### `search:target_scope`

Scope of the data collection.

> Global · Regional · Local

### `search:Object_Type`

*Select the categories within which the data would fit into.* A classification
of the target rather than its identity. It groups the narrow vocabularies below.

#### `search:Small_Body`

Small body classifications.

`search:asteroid_type`
: Asteroid.

  > Near_Earth · Trojan · Active · Main_Belt · PHA

`search:trans_neptunian_object_type`
: Trans-Neptunian Object.

  > Classical · Resonant · Scattered · Detached

`search:centaur_type`
: Centaur.

  > Active · Inactive

`search:kuiper_belt_object_type`
: Kuiper Belt Object.

  > Classical · Resonant · Scattered

`search:oort_cloud_object_type`
: Oort Cloud Object.

  > Inner · Outer

`search:comet_type`
: Comet.

  > Jupiter_Family · Single_Pass

`search:satellite_type`
: Satellite.

  > Icy_Moons · Galilean_Moons · Irregular_Moons · Captured_Moons · Shepherding_Moon

#### `search:planet_type`

Planet.

> Gas_Giant · Terrestrial · Interior

#### `search:Atmosphere`

Atmosphere of a celestial body.

`search:atmospheric_layer`
: Layer of the atmosphere.

  > Troposphere · Stratosphere · Ionosphere · Exosphere

`search:atmosphere_study_type`
: Type of study of the atmosphere.

  > Temperature_Profile · Scale_Height · Density_Profile

#### `search:particles_and_fields_type`

Fields of an object.

> Particles · Cosmic_Rays · X-Rays · Gamma-Rays · Electromagnetic_Waves

#### `search:dust_type`

Dust.

> Meteoroids · IPD · Comet

#### `search:Rings`

Rings of an object.

`search:ring_type`
: Type of ring. The single-letter values are the Saturnian ring naming
  convention.

  > D · C · B · A · F · G · E

`search:ring_division`
: Division of the ring.

  > Cassini_Division · Encke · Keeler

`search:ring_feature`
: Feature of the ring.

  > Spiral_Bending_Waves · Spokes · Spiral_Density_Waves

#### `search:solar_component_type`

Solar component.

> Corona · Solar_Wind · Exoplanets · Heliosphere · Core · Radiative_Zone ·
> Convective_Zone · Photosphere · Chromosphere

#### `search:solar_system_context`

Solar system or planetary system as the target context.

> Solar_System

#### `search:exoplanet_type`

Type of an exoplanet.

> Terrestrial · Gas Giants · Ice Giants · Super-Earths · Mini-Neptunes ·
> Lava Worlds · Ocean Worlds · Rogue Planets

### `search:Feature`

Named or classified surface features that the data set is about.

`search:feature_name`
: Name of the feature. Free text; use the IAU-approved name where one exists.

`search:feature_type`
: Type of the feature. Largely follows IAU descriptor terms.

  > Albedo · Arcus · Astronaut_Named_Feature · Catena · Chaos · Chasma · Cloud ·
  > Corona · Collis · Crater · Dorsum · Dunes · Eruptive_Center · Fluctus · Fossa ·
  > Insula · Linea · Mensa · Marcula · Mons · Mare · Oceanus · Planum · Plume ·
  > Pits · Pingo · Planitia · Regio · Rima · Ring · Rupes · Saxum · Sulcus ·
  > Terra · Tholus · Valley · Volcano · Virga

### `search:Physical_Properties`

*Information about the physical properties of the object under study.*

`search:material_type`
: Material type of the object.

  > Rock · Ice · Gas · Dust · Regolith · Liquid

`search:process_type`
: Type of process being studied.

  > Impact · Volcanic · Tectonic · Atmospheric · Erosional

`search:composition_type`
: Primary composition of the material being studied.

  > Silicate · Metal · Organic · Icy · Gaseous · Mixed

### `search:Environmental_Context`

*Information about the environmental conditions at the study location.* These
are qualitative bands, not measurements. Use them to say what regime the study
sits in; the actual numbers belong in the data and in the appropriate
discipline dictionaries.

`search:temperature_regime`
: Temperature conditions at the study location.

  > Cryogenic · Cold · Temperate · Warm · Hot

`search:pressure_conditions`
: Pressure conditions at the study location.

  > Vacuum · Very_Low · Earth_Like · High · Extreme · Variable

`search:radiation_environment`
: Radiation conditions at the study location.

  > Low · Moderate · High · Extreme · Shielded

`search:atmospheric_presence`
: Presence and nature of atmosphere at the study location.

  > None · Trace · Low · High · Extreme · Variable

---

## `search:Data_Collection`

*Information about how the data was collected and its format.*

### `search:collection_method`

Method used to collect the data.

> Orbiter · Lander · Rover · Flyby · Telescope · Sample_Return · Laboratory ·
> Modeling

### `search:instrument_type`

Type of instrument used to collect the data. A broad category for search — the
specific instrument belongs in `Observing_System_Component`.

> Spectrometer · Imager · Radar · LiDAR · Seismometer · Magnetometer ·
> Mass_Spectrometer · Dust_Particle_Detector

### `search:data_category`

General category of the collected data.

> Altimetry · Image · Photometry · Map · Model · Simulation · Database ·
> Big_Data · Parameter_Data

### `search:data_format`

Format of the collected data. This describes the *kind of product* — what the
data are — rather than the file encoding, which `File_Area` already records.

> Shape_Model_DTM · Geologic_Map · Thermal_Map · Mosaic · Spectral_Map ·
> Gazetteer · Time_Series · Crater · Light_Curve · Spectral ·
> Physical_Properties · Photometric_Properties · Gravity_Map · Taxonomies ·
> Crater_Type

### `search:Temporal_Epoch`

*The temporal epoch of the data collection.* Geologic time, not observation
time — `Time_Coordinates` records when the data were taken. Use this when a data
set is about a period in a body's history, such as a crater-count study of a
particular Martian epoch. Each body has its own timescale, so the attributes are
per-body rather than one shared scale.

`search:earth_geologic_epoch`
: Temporal epoch of the Earth.

  > Eoarchean · Paleoarchean · Mesoarchean · Neoarchean · Paleoproterozoic ·
  > Mesoproterozoic · Neoproterozoic · Paleozoic · Mesozoic · Cenozoic

`search:moon_geologic_epoch`
: Temporal epoch of the Moon.

  > Pre-Nectarian · Nectarian · Imbrian · Eratosthenian · Copernican

`search:mars_geologic_epoch`
: Temporal epoch of Mars.

  > Pre-Noachian · Noachian · Hesperian · Amazonian

`search:vesta_geologic_epoch`
: Relative timescale for Vesta.

  > Pre-Veneneia · Veneneia · Rheasilvia · Marcia

`search:ceres_geologic_epoch`
: Relative timescale for Ceres.

  > Pre-Kerwan · Kerwan · Ernutet

---

## `search:Research_Context`

*Information about the research context and associated metadata.* Who produced
the data set, what they were trying to learn, and what they used to do it. The
first five attributes are free text with no suggested vocabulary.

### `search:research_goals`

The goal of the research endeavor. A sentence or two, in plain language.

### `search:related_publications`

Related publications of the study. A citation or DOI. Formal references still
belong in `Reference_List`; this is for the paper a searcher would want to read
next.

### `search:keywords`

Suggested keywords to describe the study. The catch-all: anything true and
searchable about this data set that the rest of the dictionary has no field for.
Repeat the attribute, one keyword per value.

### `search:principal_investigator`

Principal investigator of the project, if different from the data set.

### `search:institution`

Institution of the study.

### `search:Software_Used`

*Software used to analyze the data.* Names of packages, so that someone looking
for data they can open in a particular tool can find it.

`search:data_visualization_software`
: Visualization software, which may include analysis tools.

  > JMARS · ISIS3 · IDL · ENVI · ArcGIS · QGIS · R · MATLAB · SBMT · Python ·
  > AstroPy · PlanetaryPy · IRAF · DS9 · GDAL · GMT

`search:modeling_software`
: Key modeling software.

  > GISS ROCKE-3D · GEODYN · Melts · COMSOL Multiphysics · FLASH · iSALE · HYDRA ·
  > SPH · CTH · LSDYNA · SPLAT · MYSTIC

`search:orbital_mechanics_software`
: Software used for navigation or modeling.

  > GMAT · STK · SPICE · Orekit · Simulink · Celestia · Rebound · Mercury · Swift

`search:digital_terrain_modeling_software`
: Key terrain modeling software.

  > SPC · Stereo · Ames Stereo Pipeline · SOCET Set · Shape_From_Shading ·
  > Shape_From_Modeling

`search:other_software`
: Any software not covered by the other values. Free text.
