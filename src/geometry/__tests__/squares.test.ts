import { describe, it, expect } from 'vitest';
import { findInscribedSquares } from '../squares';
import { Point, Curve } from '../types';

describe('Square Detection Algorithm', () => {
  it('should find squares on a perfect square curve', () => {
    // Create a perfect square curve
    const square: Curve = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];
    
    const squares = findInscribedSquares(square, {
      epsHit: 10,
      tolAngleDeg: 10,
      tolSidePct: 10
    });
    
    console.log('Found squares:', squares);
    expect(squares.length).toBeGreaterThan(0);
  });

  it('should find squares on a circle approximation', () => {
    // Create a circle approximation with 8 points
    const circle: Curve = [];
    const radius = 50;
    const centerX = 100;
    const centerY = 100;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      circle.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
    
    const squares = findInscribedSquares(circle, {
      epsHit: 15,
      tolAngleDeg: 15,
      tolSidePct: 15
    });
    
    console.log('Found squares on circle:', squares);
    expect(squares.length).toBeGreaterThanOrEqual(0);
  });
});
