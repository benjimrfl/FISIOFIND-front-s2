'use client';
// Cuestionarios.jsx
import React, { useState } from 'react';

const QuestionnaireBuilder = ({ setSchema, setUischema }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    label: '',
    type: 'string',
    options: []
  });

  const questionTypes = [
    { value: 'string', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'select', label: 'Selección' }
  ];

  const addQuestion = () => {
    if (!newQuestion.label) return alert('La pregunta no puede estar vacía');
    
    // Añadir la pregunta al array de preguntas
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  
    // Resetear el estado de 'newQuestion' pero manteniendo el tipo y opciones si ya las ha seleccionado
    setNewQuestion({ label: '', type: 'string', options: [] });
  };

  const generateSchemas = () => {
    const properties = {};
    const elements = [];

    questions.forEach((q, index) => {
      const propertyName = `q${index + 1}`;
      if (q.type === 'select') {
        properties[propertyName] = { type: 'string', enum: q.options };
      } else {
        properties[propertyName] = { type: q.type };
      }

      elements.push({
        type: 'Control',
        label: q.label,
        scope: `#/properties/${propertyName}`
      });
    });

    const jsonSchema = { type: 'object', properties };
    const uiSchema = { type: 'Group', label: 'Cuestionario Personalizado', elements };

    // Actualizar el estado de los esquemas
    setSchema(jsonSchema);
    setUischema(uiSchema);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Editor de Cuestionario</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          style={{ marginRight: '1rem' }}
          placeholder="Pregunta (Ej: ¿Dónde te duele?)"
          value={newQuestion.label}
          onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
        />

        <select
          style={{ marginRight: '1rem' }}
          value={newQuestion.type}
          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
        >
          {questionTypes.map((qt) => (
            <option key={qt.value} value={qt.value}>
              {qt.label}
            </option>
          ))}
        </select>

        {newQuestion.type === 'select' && (
          <input
            style={{ marginTop: '0.5rem' }}
            placeholder="Opciones separadas por coma (Ej: Leve,Moderado,Severo)"
            value={newQuestion.options.join(',')} // Cambié esto para que el valor esté siempre sincronizado
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, options: e.target.value.split(',') })
            }
          />
        )}

        <button onClick={addQuestion} style={{ marginTop: '0.5rem' }}>
          Añadir pregunta
        </button>
      </div>

      <h3>Preguntas Añadidas:</h3>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            {q.label} - Tipo: {q.type}{' '}
            {q.type === 'select' && `(Opciones: ${q.options.join(', ')})`}
          </li>
        ))}
      </ul>

      <button onClick={generateSchemas} style={{ marginTop: '1rem' }}>
        Generar Cuestionario
      </button>
    </div>
  );
};

export default QuestionnaireBuilder;
