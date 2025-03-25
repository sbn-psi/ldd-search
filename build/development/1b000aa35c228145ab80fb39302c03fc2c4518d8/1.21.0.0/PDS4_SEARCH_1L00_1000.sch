<?xml version="1.0" encoding="UTF-8"?>
  <!-- PDS4 Schematron for Name Space Id:search  Version:1.0.0.0 - Tue Mar 25 23:43:54 UTC 2025 -->
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
    <sch:rule context="search:Data_Collection/search:collection_method">
      <sch:assert test=". = ('Laboratory', 'Lander', 'Orbiter', 'Other', 'Rover', 'Sample_Return', 'Telescope')">
        <title>search:Data_Collection/search:collection_method/search:collection_method</title>
        The attribute search:Data_Collection/search:collection_method must be equal to one of the following values 'Laboratory', 'Lander', 'Orbiter', 'Other', 'Rover', 'Sample_Return', 'Telescope'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Data_Collection/search:data_type">
      <sch:assert test=". = ('Image', 'Map', 'Model_Output', 'Other', 'Spectrum', 'Time_Series')">
        <title>search:Data_Collection/search:data_type/search:data_type</title>
        The attribute search:Data_Collection/search:data_type must be equal to one of the following values 'Image', 'Map', 'Model_Output', 'Other', 'Spectrum', 'Time_Series'.</sch:assert>
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
    <sch:rule context="search:Mission_Context/search:processing_level">
      <sch:assert test=". = ('Calibrated', 'Derived_Product', 'Mosaic', 'Other', 'Raw')">
        <title>search:Mission_Context/search:processing_level/search:processing_level</title>
        The attribute search:Mission_Context/search:processing_level must be equal to one of the following values 'Calibrated', 'Derived_Product', 'Mosaic', 'Other', 'Raw'.</sch:assert>
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
    <sch:rule context="search:Scientific_Discipline/search:investigation_type">
      <sch:assert test=". = ('Modeling', 'Observation', 'Other', 'Remote_Sensing', 'Sample_Analysis')">
        <title>search:Scientific_Discipline/search:investigation_type/search:investigation_type</title>
        The attribute search:Scientific_Discipline/search:investigation_type must be equal to one of the following values 'Modeling', 'Observation', 'Other', 'Remote_Sensing', 'Sample_Analysis'.</sch:assert>
    </sch:rule>
  </sch:pattern>
  <sch:pattern>
    <sch:rule context="search:Scientific_Discipline/search:primary_field">
      <sch:assert test=". = ('Astrobiology', 'Astronomy', 'Atmospheric_Science', 'Dynamics', 'Geology', 'Geophysics', 'Laboratory_Studies', 'Magnetospheres', 'Other', 'Space_Physics')">
        <title>search:Scientific_Discipline/search:primary_field/search:primary_field</title>
        The attribute search:Scientific_Discipline/search:primary_field must be equal to one of the following values 'Astrobiology', 'Astronomy', 'Atmospheric_Science', 'Dynamics', 'Geology', 'Geophysics', 'Laboratory_Studies', 'Magnetospheres', 'Other', 'Space_Physics'.</sch:assert>
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
    <sch:rule context="search:Target_Object/search:body_type">
      <sch:assert test=". = ('Asteroid', 'Comet', 'Exoplanet', 'Moon', 'Other', 'Planet')">
        <title>search:Target_Object/search:body_type/search:body_type</title>
        The attribute search:Target_Object/search:body_type must be equal to one of the following values 'Asteroid', 'Comet', 'Exoplanet', 'Moon', 'Other', 'Planet'.</sch:assert>
    </sch:rule>
  </sch:pattern>
</sch:schema>
