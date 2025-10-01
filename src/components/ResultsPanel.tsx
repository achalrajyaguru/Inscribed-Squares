import React from 'react';
import { Square } from '../geometry/types';
import { formatPoint } from '../utils/format';

interface ResultsPanelProps {
  squares: Square[];
}

export function ResultsPanel({ squares }: ResultsPanelProps) {
  if (squares.length === 0) {
    return (
      <div className="results-panel">
        <h3>Results</h3>
        <p>No squares found. Draw a closed loop and click Generate.</p>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <h3>Results ({squares.length} squares found)</h3>
      <div className="squares-list">
        {squares.map((square, index) => (
          <div key={square.id} className="square-item">
            <div className="square-header">
              Square #{index + 1}: Side length {square.side.toFixed(2)}px
            </div>
            <div className="square-coordinates">
              {square.vertices.map((vertex, vertexIndex) => (
                <span key={vertexIndex} className="vertex-coord">
                  {formatPoint(vertex)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
