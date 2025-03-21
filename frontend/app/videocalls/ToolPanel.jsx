import React from 'react';
import styles from './Room.module.css';

// Subcomponentes de cada herramienta
import Historial from './tools/Historial';
import Modelo3D from './hooks/3DModel';
import Plantillas from './tools/Templates';
import Cuestionarios from './tools/Questionnaires';

const ToolPanel = ({
  selectedTool,
  activePainMap,
  handlePainMapSelect,
  sendPainMapToPatient,
  userRole // Añadido para pasarlo a AnatomicalModel
}) => {
  if (!selectedTool) return null;

  return (
    <div className={styles.toolContent}>
      {selectedTool === 'historial' && <Historial />}
      {selectedTool === 'modelo3d' && (
        <Modelo3D isVisible={true} userRole={userRole} />
      )}
      {selectedTool === 'plantillas' && (
        <Plantillas
          activePainMap={activePainMap}
          handlePainMapSelect={handlePainMapSelect}
          sendPainMapToPatient={sendPainMapToPatient}
        />
      )}
      {selectedTool === 'cuestionarios' && <Cuestionarios />}
    </div>
  );
};

export default ToolPanel;