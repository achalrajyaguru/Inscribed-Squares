import React from 'react';
import { CanvasState } from '../geometry/types';
import { downloadJSON, downloadCanvas } from '../utils/format';

interface ControlsProps {
  state: CanvasState;
  onGenerate: () => void;
  onUndo: () => void;
  onClear: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function Controls({ state, onGenerate, onUndo, onClear, canvasRef }: ControlsProps) {
  const canGenerate = state.isClosed && state.points.length >= 40;
  
  const handleExportJSON = () => {
    const data = {
      points: state.points,
      squares: state.squares,
      timestamp: new Date().toISOString()
    };
    downloadJSON(data, 'inscribed-squares.json');
  };

  const handleSavePNG = () => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current, 'inscribed-squares.png');
    }
  };

  return (
    <div className="controls">
      <button
        className="control-button primary"
        onClick={onGenerate}
        disabled={!canGenerate}
        title={!canGenerate ? 'Draw a closed loop with at least 40 points' : 'Generate inscribed squares'}
      >
        Generate
      </button>
      
      <button
        className="control-button"
        onClick={onUndo}
        disabled={state.points.length === 0}
        title="Remove last point"
      >
        Undo
      </button>
      
      <button
        className="control-button"
        onClick={onClear}
        disabled={state.points.length === 0}
        title="Clear all points"
      >
        Clear
      </button>
      
      <button
        className="control-button"
        onClick={handleExportJSON}
        disabled={state.squares.length === 0}
        title="Export squares as JSON"
      >
        Export JSON
      </button>
      
      <button
        className="control-button"
        onClick={handleSavePNG}
        disabled={!canvasRef.current}
        title="Save canvas as PNG"
      >
        Save PNG
      </button>
    </div>
  );
}
