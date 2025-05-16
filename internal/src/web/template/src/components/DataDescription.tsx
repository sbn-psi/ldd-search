import React from 'react';
import Handlebars from 'handlebars';
import { formatDisplayName } from '../utils/format';

// Register helper for array handling
Handlebars.registerHelper('if', function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('each', function(context, options) {
  if (!context || !Array.isArray(context)) return '';
  let ret = '';
  for (let i = 0, j = context.length; i < j; i++) {
    ret = ret + options.fn(context[i], {
      index: i,
      first: i === 0,
      last: i === j - 1
    });
  }
  return ret;
});

interface DataDescriptionProps {
  selectedClasses: Record<string, boolean>;
  selectedAttributes: Record<string, boolean>;
  attributeValues: Record<string, string | string[]>;
}

function transformData(selectedClasses: Record<string, boolean>, selectedAttributes: Record<string, boolean>, attributeValues: Record<string, string | string[]>) {
  const data: Record<string, any> = {};
  
  // Helper function to set nested value
  const setNestedValue = (obj: Record<string, any>, path: string, value: string | string[]) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = current[keys[i]] || {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  };

  // Process each selected attribute
  Object.entries(selectedAttributes).forEach(([key, isSelected]) => {
    if (isSelected) {
      const [className, attrName] = key.split('.');
      if (selectedClasses[className]) {
        const rawValue = attributeValues?.[`${className}.${attrName}`];
        if (rawValue) {
          if (Array.isArray(rawValue)) {
            const formattedValues = rawValue
              .filter(v => v !== 'other')
              .map(v => formatDisplayName(v));
            const other = attributeValues?.[`${className}.${attrName}.other`];
            if (other && typeof other === 'string') {
              formattedValues.push(other);
            }
            setNestedValue(data, `${className}.${attrName}`, formattedValues);
          } else {
            const formattedValue = formatDisplayName(rawValue);
            const other = attributeValues?.[`${className}.${attrName}.other`];
            if (other && typeof other === 'string') {
              setNestedValue(data, `${className}.${attrName}`, [formattedValue, other]);
            } else {
              setNestedValue(data, `${className}.${attrName}`, [formattedValue]);
            }
          }
        }
      }
    }
  });

  return data;
}

// Register helper for formatting display names
Handlebars.registerHelper('format', function(value) {
  return formatDisplayName(value);
});

const template = `{{#if Scientific_Discipline}}I work in {{#each Scientific_Discipline.Scientific_fields}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{#if Scientific_Discipline.Investigation_Technique}} using {{#each Scientific_Discipline.Investigation_Technique}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Scientific_Discipline.Study_Focus}} with a focus on {{#each Scientific_Discipline.Study_Focus}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}.{{/if}}

{{#if Target_Object}}I study {{Target_Object.Object_Name}}{{#if Scope}} at a {{format Scope}} scale{{/if}}{{#if Object_Type}} which is a {{format Object_Type.Planet}} planet{{/if}}{{#if Feature}}{{#if Feature.Name}} featuring {{format Feature.Name}}{{#if Feature.Type}} which is a {{format Feature.Type}}{{/if}}{{/if}}{{/if}}{{#if Physical_Properties}}{{#if Physical_Properties.Material_Type}} with {{#each Physical_Properties.Material_Type}}{{#if @index}}, {{/if}}{{format this}}{{/each}} material{{/if}}{{#if Physical_Properties.Process_Type}} and {{#each Physical_Properties.Process_Type}}{{#if @index}}, {{/if}}{{format this}}{{/each}} process{{/if}}{{/if}}.{{/if}}

{{#if Data_Collection}}The data was collected using {{#if Data_Collection.Collection_Method}}{{#each Data_Collection.Collection_Method}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Data_Collection.Instrument_Type}} with {{#each Data_Collection.Instrument_Type}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Data_Collection.Data_Category}} to produce {{#each Data_Collection.Data_Category}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Data_Collection.Data_Format}} in {{#each Data_Collection.Data_Format}}{{#if @index}}, {{/if}}{{format this}} format{{/each}}{{/if}}.{{/if}}

{{#if Research_Context}}{{#if Research_Context.Research_Goals}}The research goals include {{#each Research_Context.Research_Goals}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Related_Publications}}. Related publications include {{#each Research_Context.Related_Publications}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Keywords}}. Keywords include {{#each Research_Context.Keywords}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Principal_Investigator}}. Principal Investigator: {{#each Research_Context.Principal_Investigator}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Institution}}. Institution: {{#each Research_Context.Institution}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Software_Used}}. Software used includes {{#if Research_Context.Software_Used.Data_Visualization}}data visualization with {{#each Research_Context.Software_Used.Data_Visualization}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Software_Used.Modeling}}, modeling with {{#each Research_Context.Software_Used.Modeling}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Software_Used.Orbital_Mechanics}}, orbital mechanics with {{#each Research_Context.Software_Used.Orbital_Mechanics}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{#if Research_Context.Software_Used.Digital_Terrain_Modeling}}, digital terrain modeling with {{#each Research_Context.Software_Used.Digital_Terrain_Modeling}}{{#if @index}}, {{/if}}{{format this}}{{/each}}{{/if}}{{/if}}.{{/if}}`;

const DataDescription: React.FC<DataDescriptionProps> = ({ selectedClasses, selectedAttributes, attributeValues }) => {
  const transformedData = transformData(selectedClasses, selectedAttributes, attributeValues);
  const compiledTemplate = Handlebars.compile(template);
  const description = compiledTemplate(transformedData);

  return (
    <div className="data-description">
      <h2>Data Description</h2>
      <div className="description-content">
        {description.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default DataDescription; 