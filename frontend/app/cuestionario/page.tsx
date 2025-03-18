'use client';
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';  // Importar JsonForms
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import MyGroupRenderer, { myGroupTester } from './MyGroupRenderer';
import QuestionnaireBuilder from './Cuestionarios';  // Mantener el import de QuestionnaireBuilder

// Registrar el renderizador personalizado
const renderers = [
  ...materialRenderers,
  { tester: myGroupTester, renderer: MyGroupRenderer } // Aquí añadimos el renderizador personalizado
];

function App() {
  const [schema, setSchema] = useState({}); // Estado para el JSON Schema
  const [uischema, setUischema] = useState({ 
    type: 'Group', // Definir el tipo 'Group' para que el renderizador funcione
    label: 'Cuestionario', // Etiqueta del grupo
    elements: [] // Aquí van los elementos que compondrán el cuestionario
  }); // Estado para el UI Schema
  const [data, setData] = useState({}); // Estado para los datos

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Generador de Cuestionarios</h1>

      {/* Aquí puedes usar JsonForms para renderizar el formulario */}
      <JsonForms
        schema={schema}
        uischema={uischema} // Ahora pasamos un uischema válido
        data={data}
        onChange={({ data }) => setData(data)}
        renderers={renderers} // Se pasa el array de renderizadores
        cells={materialCells}
      />

      {/* Mantener el componente QuestionnaireBuilder para que el fisio genere el cuestionario */}
      <QuestionnaireBuilder setSchema={setSchema} setUischema={setUischema} />
    </div>
  );
}

export default App;
