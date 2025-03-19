'use client';
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import MyGroupRenderer, { myGroupTester } from './MyGroupRenderer';
import QuestionnaireBuilder from './Cuestionarios';

type Questionnaire = {
  id: string;
  title: string;
  jsonSchema: any;
  uiSchema: any;
  questions: any[]; // Para poder editar después
};

const renderers = [
  ...materialRenderers,
  { tester: myGroupTester, renderer: MyGroupRenderer },
];

function App() {
  const [schema, setSchema] = useState({});
  const [uischema, setUischema] = useState({ type: 'Group', label: 'Cuestionario', elements: [] });
  const [data, setData] = useState({});
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);

  const addOrUpdateQuestionnaire = (newQ: Questionnaire) => {
    if (editingQuestionnaire) {
      // Editando uno existente
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === editingQuestionnaire.id ? newQ : q))
      );
      setEditingQuestionnaire(null);
    } else {
      // Añadiendo uno nuevo
      setQuestionnaires((prev) => [...prev, newQ]);
    }

    setSchema(newQ.jsonSchema);
    setUischema(newQ.uiSchema);
  };

  const deleteQuestionnaire = (id: string) => {
    setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
  };

  const editQuestionnaire = (q: Questionnaire) => {
    setEditingQuestionnaire(q);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Generador de Cuestionarios</h1>

      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        onChange={({ data }) => setData(data)}
        renderers={renderers}
        cells={materialCells}
      />

      <QuestionnaireBuilder
        addQuestionnaire={addOrUpdateQuestionnaire}
        editingQuestionnaire={editingQuestionnaire}
      />

      <div style={{ marginTop: '2rem' }}>
        <h3>Cuestionarios Generados:</h3>
        <ul>
          {questionnaires.map((q) => (
            <li key={q.id}>
              {q.title} (ID: {q.id})
              <button onClick={() => editQuestionnaire(q)} style={{ marginLeft: '1rem' }}>Ver/Editar</button>
              <button onClick={() => deleteQuestionnaire(q.id)} style={{ marginLeft: '0.5rem' }}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

