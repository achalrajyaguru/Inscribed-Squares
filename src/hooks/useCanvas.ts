import { useRef, useCallback, useState } from 'react';
import { Point, CanvasState } from '../geometry/types';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CanvasState>({
    points: [],
    isClosed: false,
    squares: [],
    isDrawing: false
  });

  const startDrawing = useCallback((point: Point) => {
    setState(prev => ({
      ...prev,
      points: [point],
      isClosed: false,
      isDrawing: true
    }));
  }, []);

  const addPoint = useCallback((point: Point) => {
    setState(prev => ({
      ...prev,
      points: [...prev.points, point]
    }));
  }, []);

  const finishDrawing = useCallback((point: Point) => {
    setState(prev => {
      if (prev.points.length === 0) return prev;
      
      const firstPoint = prev.points[0];
      const lastPoint = point;
      
      // Always connect first and last points to create a closed loop
      const isClosed = true;
      
      return {
        ...prev,
        isClosed,
        isDrawing: false,
        points: [...prev.points, firstPoint] // Always close the loop
      };
    });
  }, []);


  const undo = useCallback(() => {
    setState(prev => ({
      ...prev,
      points: prev.points.slice(0, -1),
      isClosed: false,
      squares: []
    }));
  }, []);

  const clear = useCallback(() => {
    setState({
      points: [],
      isClosed: false,
      squares: [],
      isDrawing: false
    });
  }, []);

  const setSquares = useCallback((squares: any[]) => {
    setState(prev => ({
      ...prev,
      squares
    }));
  }, []);

  const getCanvasPoint = useCallback((clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  return {
    canvasRef,
    state,
    startDrawing,
    addPoint,
    finishDrawing,
    undo,
    clear,
    setSquares,
    getCanvasPoint
  };
}
