<?xml version="1.0" encoding="UTF-8"?>
  <!-- PDS4 Schematron for Name Space Id:search  Version:1.0.0.0 - Fri Apr 04 18:21:14 UTC 2025 -->
  <!-- Generated from the PDS4 Information Model Version 1.21.0.0 - System Build 14.0 -->
  <!-- *** This PDS4 schematron file is an operational deliverable. *** -->
<sch:schema xmlns:sch="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt2">

  <sch:title>Schematron using XPath 2.0</sch:title>

  <sch:ns uri="http://www.w3.org/2001/XMLSchema-instance" prefix="xsi"/>
  <sch:ns uri="http://pds.nasa.gov/pds4/pds/v1" prefix="pds"/>
  <sch:ns uri="http://pds.nasa.gov/pds4/search/v1" prefix="search"/>

		   <!-- ================================================ -->
		   <!-- NOTE:  There are two types of schematron rules.  -->
		   <!--        One type includes rules written for       -->
		   <!--        specific situations. The other type are   -->
		   <!--        generated to validate enumerated value    -->
		   <!--        lists. These two types of rules have been -->
		   <!--        merged together in the rules below.       -->
		   <!-- ================================================ -->
  <sch:pattern>
    <sch:rule context="search:Analysis_Properties/search:analysis_method">
      <sch:assert test=". = ('Image_Processing', 'Machine_Learning', 'Manual', 'Modeling', 'Other', 'Spectral', 'Statistical')">
        <title>search:Analysis_Properties/search:analysis_method/search:analysis_method</title>
        The attribute search:Analysis_Properties/search:analysis_method must be equal to one of the following values 'Image_Processing', 'Machine_Learning', 'Manual', 'Modeling', 'Other', 'Spectral', 'Statistical'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Analysis_Properties/search:quality_indicators">
      <sch:assert test=". = ('High', 'Low', 'Medium', 'Other', 'Unassessed', 'Variable')">
        <title>search:Analysis_Properties/search:quality_indicators/search:quality_indicators</title>
        The attribute search:Analysis_Properties/search:quality_indicators must be equal to one of the following values 'High', 'Low', 'Medium', 'Other', 'Unassessed', 'Variable'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:asteroid_type">
      <sch:assert test=". = ('Active', 'Main_Belt', 'Near_Earth', 'Other', 'Trojan')">
        <title>search:Body_Type/search:asteroid_type/search:asteroid_type</title>
        The attribute search:Body_Type/search:asteroid_type must be equal to one of the following values 'Active', 'Main_Belt', 'Near_Earth', 'Other', 'Trojan'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:atmospheric_layer">
      <sch:assert test=". = ('Exosphere', 'Ionosphere', 'Other', 'Stratosphere', 'Troposphere')">
        <title>search:Body_Type/search:atmospheric_layer/search:atmospheric_layer</title>
        The attribute search:Body_Type/search:atmospheric_layer must be equal to one of the following values 'Exosphere', 'Ionosphere', 'Other', 'Stratosphere', 'Troposphere'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:centaur_type">
      <sch:assert test=". = ('Active', 'Inactive', 'Other')">
        <title>search:Body_Type/search:centaur_type/search:centaur_type</title>
        The attribute search:Body_Type/search:centaur_type must be equal to one of the following values 'Active', 'Inactive', 'Other'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:comet_type">
      <sch:assert test=". = ('Halley_Type', 'Jupiter_Family', 'Long_Period', 'Other', 'Single_Pass')">
        <title>search:Body_Type/search:comet_type/search:comet_type</title>
        The attribute search:Body_Type/search:comet_type must be equal to one of the following values 'Halley_Type', 'Jupiter_Family', 'Long_Period', 'Other', 'Single_Pass'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:dust_type">
      <sch:assert test=". = ('Interplanetary_Dust', 'Meteoroid', 'Other')">
        <title>search:Body_Type/search:dust_type/search:dust_type</title>
        The attribute search:Body_Type/search:dust_type must be equal to one of the following values 'Interplanetary_Dust', 'Meteoroid', 'Other'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:feature_type">
      <sch:assert test=". = ('Cloud', 'Crater', 'Mare', 'Mountain', 'Other', 'Valley', 'Volcano')">
        <title>search:Body_Type/search:feature_type/search:feature_type</title>
        The attribute search:Body_Type/search:feature_type must be equal to one of the following values 'Cloud', 'Crater', 'Mare', 'Mountain', 'Other', 'Valley', 'Volcano'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:field_type">
      <sch:assert test=". = ('Cosmic_Ray', 'Electromagnetic_Wave', 'Gamma_Ray', 'Other', 'Particle', 'X_Ray')">
        <title>search:Body_Type/search:field_type/search:field_type</title>
        The attribute search:Body_Type/search:field_type must be equal to one of the following values 'Cosmic_Ray', 'Electromagnetic_Wave', 'Gamma_Ray', 'Other', 'Particle', 'X_Ray'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:kbo_type">
      <sch:assert test=". = ('Classical', 'Other', 'Resonant', 'Scattered')">
        <title>search:Body_Type/search:kbo_type/search:kbo_type</title>
        The attribute search:Body_Type/search:kbo_type must be equal to one of the following values 'Classical', 'Other', 'Resonant', 'Scattered'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:oort_cloud_type">
      <sch:assert test=". = ('Inner', 'Other', 'Outer')">
        <title>search:Body_Type/search:oort_cloud_type/search:oort_cloud_type</title>
        The attribute search:Body_Type/search:oort_cloud_type must be equal to one of the following values 'Inner', 'Other', 'Outer'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:planet_type">
      <sch:assert test=". = ('Gas_Giant', 'Interior', 'Other', 'Terrestrial')">
        <title>search:Body_Type/search:planet_type/search:planet_type</title>
        The attribute search:Body_Type/search:planet_type must be equal to one of the following values 'Gas_Giant', 'Interior', 'Other', 'Terrestrial'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:ring_division">
      <sch:assert test=". = ('Cassini_Division', 'Encke_Division', 'Keeler_Gap', 'Other')">
        <title>search:Body_Type/search:ring_division/search:ring_division</title>
        The attribute search:Body_Type/search:ring_division must be equal to one of the following values 'Cassini_Division', 'Encke_Division', 'Keeler_Gap', 'Other'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:ring_feature">
      <sch:assert test=". = ('Other', 'Spiral_Bending_Wave', 'Spiral_Density_Wave', 'Spoke')">
        <title>search:Body_Type/search:ring_feature/search:ring_feature</title>
        The attribute search:Body_Type/search:ring_feature must be equal to one of the following values 'Other', 'Spiral_Bending_Wave', 'Spiral_Density_Wave', 'Spoke'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:ring_section">
      <sch:assert test=". = ('A_Ring', 'B_Ring', 'C_Ring', 'D_Ring', 'E_Ring', 'F_Ring', 'G_Ring', 'Other')">
        <title>search:Body_Type/search:ring_section/search:ring_section</title>
        The attribute search:Body_Type/search:ring_section must be equal to one of the following values 'A_Ring', 'B_Ring', 'C_Ring', 'D_Ring', 'E_Ring', 'F_Ring', 'G_Ring', 'Other'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:satellite_type">
      <sch:assert test=". = ('Captured', 'Galilean', 'Icy', 'Irregular', 'Other', 'Shepherding')">
        <title>search:Body_Type/search:satellite_type/search:satellite_type</title>
        The attribute search:Body_Type/search:satellite_type must be equal to one of the following values 'Captured', 'Galilean', 'Icy', 'Irregular', 'Other', 'Shepherding'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:solar_component">
      <sch:assert test=". = ('Chromosphere', 'Convective_Zone', 'Core', 'Corona', 'Heliosphere', 'Other', 'Photosphere', 'Radiative_Zone', 'Solar_Wind')">
        <title>search:Body_Type/search:solar_component/search:solar_component</title>
        The attribute search:Body_Type/search:solar_component must be equal to one of the following values 'Chromosphere', 'Convective_Zone', 'Core', 'Corona', 'Heliosphere', 'Other', 'Photosphere', 'Radiative_Zone', 'Solar_Wind'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Body_Type/search:tno_type">
      <sch:assert test=". = ('Classical', 'Detached', 'Other', 'Resonant', 'Scattered')">
        <title>search:Body_Type/search:tno_type/search:tno_type</title>
        The attribute search:Body_Type/search:tno_type must be equal to one of the following values 'Classical', 'Detached', 'Other', 'Resonant', 'Scattered'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Data_Collection/search:collection_method">
      <sch:assert test=". = ('Laboratory', 'Lander', 'Orbiter', 'Other', 'Rover', 'Sample_Return', 'Telescope')">
        <title>search:Data_Collection/search:collection_method/search:collection_method</title>
        The attribute search:Data_Collection/search:collection_method must be equal to one of the following values 'Laboratory', 'Lander', 'Orbiter', 'Other', 'Rover', 'Sample_Return', 'Telescope'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Data_Collection/search:data_category">
      <sch:assert test=". = ('Altimetry', 'Database', 'Image', 'Map', 'Model_Output', 'Other', 'Parameter_Data', 'Photometry')">
        <title>search:Data_Collection/search:data_category/search:data_category</title>
        The attribute search:Data_Collection/search:data_category must be equal to one of the following values 'Altimetry', 'Database', 'Image', 'Map', 'Model_Output', 'Other', 'Parameter_Data', 'Photometry'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Data_Collection/search:data_format">
      <sch:assert test=". = ('Crater', 'Crater_Type', 'Gazetteer', 'Geologic_Map', 'Gravity_Map', 'Light_Curve', 'Mosaic', 'Photometric_Properties', 'Physical_Properties', 'Shape_Model_DTM', 'Spectral', 'Spectral_Map', 'Taxonomies', 'Thermal_Map', 'Time_Series')">
        <title>search:Data_Collection/search:data_format/search:data_format</title>
        The attribute search:Data_Collection/search:data_format must be equal to one of the following values 'Crater', 'Crater_Type', 'Gazetteer', 'Geologic_Map', 'Gravity_Map', 'Light_Curve', 'Mosaic', 'Photometric_Properties', 'Physical_Properties', 'Shape_Model_DTM', 'Spectral', 'Spectral_Map', 'Taxonomies', 'Thermal_Map', 'Time_Series'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Data_Collection/search:instrument_type">
      <sch:assert test=". = ('Camera', 'Lidar', 'Magnetometer', 'Other', 'Radar', 'Seismometer', 'Spectrometer')">
        <title>search:Data_Collection/search:instrument_type/search:instrument_type</title>
        The attribute search:Data_Collection/search:instrument_type must be equal to one of the following values 'Camera', 'Lidar', 'Magnetometer', 'Other', 'Radar', 'Seismometer', 'Spectrometer'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Data_Collection/search:temporal_epoch">
      <sch:assert test=". = ('Amazonian', 'Archean', 'Azaccan', 'Copernican', 'Eratosthenian', 'Hesperian', 'Imbrian', 'Kerwanan', 'Nectarian', 'Noachian', 'Other', 'Paleozoic', 'Pre-Kerwanan', 'Proterozoic', 'Yalodean')">
        <title>search:Data_Collection/search:temporal_epoch/search:temporal_epoch</title>
        The attribute search:Data_Collection/search:temporal_epoch must be equal to one of the following values 'Amazonian', 'Archean', 'Azaccan', 'Copernican', 'Eratosthenian', 'Hesperian', 'Imbrian', 'Kerwanan', 'Nectarian', 'Noachian', 'Other', 'Paleozoic', 'Pre-Kerwanan', 'Proterozoic', 'Yalodean'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Environmental_Context/search:atmospheric_presence">
      <sch:assert test=". = ('Earth_Like', 'Gas_Giant', 'None', 'Other', 'Thick', 'Thin', 'Very_Thin')">
        <title>search:Environmental_Context/search:atmospheric_presence/search:atmospheric_presence</title>
        The attribute search:Environmental_Context/search:atmospheric_presence must be equal to one of the following values 'Earth_Like', 'Gas_Giant', 'None', 'Other', 'Thick', 'Thin', 'Very_Thin'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Environmental_Context/search:pressure_conditions">
      <sch:assert test=". = ('Earth_Like', 'Extreme', 'High', 'Other', 'Vacuum', 'Variable', 'Very_Low')">
        <title>search:Environmental_Context/search:pressure_conditions/search:pressure_conditions</title>
        The attribute search:Environmental_Context/search:pressure_conditions must be equal to one of the following values 'Earth_Like', 'Extreme', 'High', 'Other', 'Vacuum', 'Variable', 'Very_Low'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Environmental_Context/search:radiation_environment">
      <sch:assert test=". = ('Extreme', 'High', 'Low', 'Moderate', 'Other', 'Shielded')">
        <title>search:Environmental_Context/search:radiation_environment/search:radiation_environment</title>
        The attribute search:Environmental_Context/search:radiation_environment must be equal to one of the following values 'Extreme', 'High', 'Low', 'Moderate', 'Other', 'Shielded'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Environmental_Context/search:temperature_regime">
      <sch:assert test=". = ('Cold', 'Cryogenic', 'Extreme_Heat', 'Hot', 'Other', 'Temperate', 'Variable')">
        <title>search:Environmental_Context/search:temperature_regime/search:temperature_regime</title>
        The attribute search:Environmental_Context/search:temperature_regime must be equal to one of the following values 'Cold', 'Cryogenic', 'Extreme_Heat', 'Hot', 'Other', 'Temperate', 'Variable'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Physical_Properties/search:composition">
      <sch:assert test=". = ('Gaseous', 'Icy', 'Metal', 'Mixed', 'Organic', 'Other', 'Silicate')">
        <title>search:Physical_Properties/search:composition/search:composition</title>
        The attribute search:Physical_Properties/search:composition must be equal to one of the following values 'Gaseous', 'Icy', 'Metal', 'Mixed', 'Organic', 'Other', 'Silicate'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Physical_Properties/search:feature_type">
      <sch:assert test=". = ('Cloud', 'Crater', 'Mare', 'Mountain', 'Other', 'Valley', 'Volcano')">
        <title>search:Physical_Properties/search:feature_type/search:feature_type</title>
        The attribute search:Physical_Properties/search:feature_type must be equal to one of the following values 'Cloud', 'Crater', 'Mare', 'Mountain', 'Other', 'Valley', 'Volcano'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Physical_Properties/search:material_type">
      <sch:assert test=". = ('Dust', 'Gas', 'Ice', 'Liquid', 'Other', 'Regolith', 'Rock')">
        <title>search:Physical_Properties/search:material_type/search:material_type</title>
        The attribute search:Physical_Properties/search:material_type must be equal to one of the following values 'Dust', 'Gas', 'Ice', 'Liquid', 'Other', 'Regolith', 'Rock'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Physical_Properties/search:process_type">
      <sch:assert test=". = ('Atmospheric', 'Erosional', 'Impact', 'Other', 'Tectonic', 'Volcanic')">
        <title>search:Physical_Properties/search:process_type/search:process_type</title>
        The attribute search:Physical_Properties/search:process_type must be equal to one of the following values 'Atmospheric', 'Erosional', 'Impact', 'Other', 'Tectonic', 'Volcanic'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Scientific_Discipline/search:investigation_technique">
      <sch:assert test=". = ('Geochemistry', 'Gravimetry', 'ICPMS', 'Mapping', 'Modeling', 'Other', 'Radar', 'SEM', 'Seismology', 'Spectroscopy', 'TEM')">
        <title>search:Scientific_Discipline/search:investigation_technique/search:investigation_technique</title>
        The attribute search:Scientific_Discipline/search:investigation_technique must be equal to one of the following values 'Geochemistry', 'Gravimetry', 'ICPMS', 'Mapping', 'Modeling', 'Other', 'Radar', 'SEM', 'Seismology', 'Spectroscopy', 'TEM'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Scientific_Discipline/search:primary_field">
      <sch:assert test=". = ('Astrobiology', 'Astronomy_Exoplanets', 'Astronomy_Observation', 'Astronomy_Radar', 'Astronomy_Spectroscopy', 'Atmospheric_Study', 'Dynamics', 'Geology_Crater_Counting', 'Geology_Geophysics', 'Geology_Interior_Studies', 'Geology_Seismology', 'Geology_Surface', 'Laboratory_Age_Dating', 'Laboratory_Analytic_Chemistry', 'Laboratory_Cosmochemistry', 'Laboratory_Geochemistry', 'Laboratory_Spectral_Analysis', 'Magnetospheres', 'Modeling', 'Other', 'Space_Physics')">
        <title>search:Scientific_Discipline/search:primary_field/search:primary_field</title>
        The attribute search:Scientific_Discipline/search:primary_field must be equal to one of the following values 'Astrobiology', 'Astronomy_Exoplanets', 'Astronomy_Observation', 'Astronomy_Radar', 'Astronomy_Spectroscopy', 'Atmospheric_Study', 'Dynamics', 'Geology_Crater_Counting', 'Geology_Geophysics', 'Geology_Interior_Studies', 'Geology_Seismology', 'Geology_Surface', 'Laboratory_Age_Dating', 'Laboratory_Analytic_Chemistry', 'Laboratory_Cosmochemistry', 'Laboratory_Geochemistry', 'Laboratory_Spectral_Analysis', 'Magnetospheres', 'Modeling', 'Other', 'Space_Physics'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Scientific_Discipline/search:study_focus">
      <sch:assert test=". = ('Atmosphere', 'Composition', 'Interior', 'Magnetosphere', 'Orbital_Dynamics', 'Other', 'Surface')">
        <title>search:Scientific_Discipline/search:study_focus/search:study_focus</title>
        The attribute search:Scientific_Discipline/search:study_focus must be equal to one of the following values 'Atmosphere', 'Composition', 'Interior', 'Magnetosphere', 'Orbital_Dynamics', 'Other', 'Surface'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Target_Object/search:scope">
      <sch:assert test="if (not(@xsi:nil eq 'true') and (not(. = ('Global', 'Local', 'Other', 'Regional')))) then false() else true()">
        <title>search:Target_Object/search:scope/search:scope</title>
        The attribute search:Target_Object/search:scope must be nulled or equal to one of the following values 'Global', 'Local', 'Other', 'Regional'.</sch:assert>
    </sch:rule>
  </sch:pattern>
</sch:schema>
