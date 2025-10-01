import { describe, it, expect } from 'vitest';
import { resampleClosed } from '../resample';
import { projectPointToSegment, distance, angleBetweenVectors, rotatePoint } from '../project';
import { findInscribedSquares } from '../squares';
import { dedupeSquares } from '../dedupe';
import { Point, Curve } from '../types';

describe('resample', () => {
  it('should resample a simple square', () => {
    const square: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];
    
    const resampled = resampleClosed(square, 4);
    expect(resampled).toHaveLength(4);
    
    // Check that we get back the original square (approximately)
    expect(resampled[0].x).toBeCloseTo(0, 1);
    expect(resampled[0].y).toBeCloseTo(0, 1);
    expect(resampled[1].x).toBeCloseTo(100, 1);
    expect(resampled[1].y).toBeCloseTo(0, 1);
  });

  it('should handle empty input', () => {
    const result = resampleClosed([], 10);
    expect(result).toEqual([]);
  });

  it('should handle single point', () => {
    const result = resampleClosed([{ x: 0, y: 0 }], 5);
    expect(result).toHaveLength(5);
    expect(result.every(p => p.x === 0 && p.y === 0)).toBe(true);
  });
});

describe('project', () => {
  it('should project point onto horizontal segment', () => {
    const result = projectPointToSegment(
      { x: 50, y: 10 },
      { x: 0, y: 0 },
      { x: 100, y: 0 }
    );
    
    expect(result.foot.x).toBeCloseTo(50, 1);
    expect(result.foot.y).toBeCloseTo(0, 1);
    expect(result.dist).toBeCloseTo(10, 1);
    expect(result.t).toBeCloseTo(0.5, 1);
  });

  it('should project point onto vertical segment', () => {
    const result = projectPointToSegment(
      { x: 10, y: 50 },
      { x: 0, y: 0 },
      { x: 0, y: 100 }
    );
    
    expect(result.foot.x).toBeCloseTo(0, 1);
    expect(result.foot.y).toBeCloseTo(50, 1);
    expect(result.dist).toBeCloseTo(10, 1);
    expect(result.t).toBeCloseTo(0.5, 1);
  });

  it('should handle degenerate segment', () => {
    const result = projectPointToSegment(
      { x: 5, y: 5 },
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    );
    
    expect(result.foot.x).toBeCloseTo(0, 1);
    expect(result.foot.y).toBeCloseTo(0, 1);
    expect(result.dist).toBeCloseTo(Math.sqrt(50), 1);
    expect(result.t).toBeCloseTo(0, 1);
  });

  it('should calculate distance correctly', () => {
    const dist = distance({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(dist).toBeCloseTo(5, 1);
  });

  it('should calculate angle between vectors', () => {
    const angle = angleBetweenVectors({ x: 1, y: 0 }, { x: 0, y: 1 });
    expect(angle).toBeCloseTo(90, 1);
  });

  it('should rotate point correctly', () => {
    const rotated = rotatePoint({ x: 1, y: 0 }, { x: 0, y: 0 }, 90);
    expect(rotated.x).toBeCloseTo(0, 1);
    expect(rotated.y).toBeCloseTo(1, 1);
  });
});

describe('squares', () => {
  it('should find squares on a perfect circle approximation', () => {
    // Create a square (which is a degenerate circle)
    const square: Curve = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];
    
    const squares = findInscribedSquares(square, {
      epsHit: 10,
      tolAngleDeg: 5,
      tolSidePct: 5
    });
    
    // Should find at least one square (the original square itself)
    expect(squares.length).toBeGreaterThan(0);
  });

  it('should handle empty curve', () => {
    const squares = findInscribedSquares([]);
    expect(squares).toEqual([]);
  });

  it('should handle curve with insufficient points', () => {
    const curve: Curve = [
      { x: 0, y: 0 },
      { x: 10, y: 0 }
    ];
    
    const squares = findInscribedSquares(curve);
    expect(squares).toEqual([]);
  });
});

describe('dedupe', () => {
  it('should deduplicate identical squares', () => {
    const square1 = {
      id: '1',
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ] as [Point, Point, Point, Point],
      side: 100,
      angle: 0
    };
    
    const square2 = {
      id: '2',
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ] as [Point, Point, Point, Point],
      side: 100,
      angle: 0
    };
    
    const deduplicated = dedupeSquares([square1, square2]);
    expect(deduplicated).toHaveLength(1);
  });

  it('should sort by side length descending', () => {
    const smallSquare = {
      id: 'small',
      vertices: [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 50 },
        { x: 0, y: 50 }
      ] as [Point, Point, Point, Point],
      side: 50,
      angle: 0
    };
    
    const largeSquare = {
      id: 'large',
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ] as [Point, Point, Point, Point],
      side: 100,
      angle: 0
    };
    
    const sorted = dedupeSquares([smallSquare, largeSquare]);
    expect(sorted[0].side).toBe(100);
    expect(sorted[1].side).toBe(50);
  });
});
