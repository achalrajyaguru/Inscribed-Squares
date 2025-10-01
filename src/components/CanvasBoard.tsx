import React, { useEffect, useRef } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useSquares } from '../hooks/useSquares';
import { Controls } from './Controls';
import { ResultsPanel } from './ResultsPanel';
import { Toast, useToast } from './Toast';

export function CanvasBoard() {
  const { canvasRef, state, startDrawing, addPoint, finishDrawing, undo, clear, setSquares, getCanvasPoint } = useCanvas();
  const { generateSquares } = useSquares();
  const { toast, showToast, hideToast } = useToast();

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e.clientX, e.clientY);
    startDrawing(point);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.isDrawing) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      addPoint(point);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.isDrawing) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      finishDrawing(point);
      showToast('Loop automatically closed!', 'success');
    }
  };

  const handleGenerate = () => {
    try {
      const squares = generateSquares(state.points);
      setSquares(squares);
      showToast(`Found ${squares.length} inscribed squares!`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error generating squares', 'error');
    }
  };

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw blackboard background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid lines
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw subtle axes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw curve
    if (state.points.length > 0) {
      // Draw chalk-like curve
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(state.points[0].x, state.points[0].y);
      for (let i = 1; i < state.points.length; i++) {
        ctx.lineTo(state.points[i].x, state.points[i].y);
      }
      ctx.stroke();

      // Draw chalk dots for points
      ctx.fillStyle = '#f0f0f0';
      state.points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw squares with vibrant chalk colors
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    state.squares.forEach((square, index) => {
      const color = colors[index % colors.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(square.vertices[0].x, square.vertices[0].y);
      for (let i = 1; i < square.vertices.length; i++) {
        ctx.lineTo(square.vertices[i].x, square.vertices[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw square vertices with chalk dots
      ctx.fillStyle = color;
      square.vertices.forEach(vertex => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }, [state, canvasRef]);

  return (
    <div className="canvas-board">
      <div className="canvas-container">
        <div className="blackboard-frame">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: 'crosshair' }}
          />
        </div>
      </div>
      
      <div className="panel-container">
        <Controls
          state={state}
          onGenerate={handleGenerate}
          onUndo={undo}
          onClear={clear}
          canvasRef={canvasRef}
        />
        
        <ResultsPanel squares={state.squares} />
      </div>
      
      <Toast message={toast} onClose={hideToast} />
    </div>
  );
}
