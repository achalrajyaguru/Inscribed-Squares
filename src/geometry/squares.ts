import { Point, Curve, Square, SquareSearchOptions, ProjectionResult } from './types';
import { projectPointToSegment, distance, angleBetweenVectors, rotatePoint } from './project';

/**
 * Find all inscribed squares on a closed curve
 */
export function findInscribedSquares(
  curve: Curve,
  opts: SquareSearchOptions = {}
): Square[] {
  const {
    epsHit = 8, // Increased tolerance for hit detection
    tolAngleDeg = 5, // Increased tolerance for angles
    tolSidePct = 5, // Increased tolerance for side lengths
    searchDiagonals = true
  } = opts;
  
  const squares: Square[] = [];
  const M = curve.length;
  
  // Search all ordered pairs of points
  for (let i = 0; i < M; i++) {
    for (let j = i + 1; j < M; j++) {
      const p1 = curve[i];
      const p2 = curve[j];
      
      // Skip if points are too close
      if (distance(p1, p2) < epsHit) continue;
      
      // Try side-based construction
      const sideBasedSquares = findSideBasedSquares(
        p1, p2, curve, epsHit, tolAngleDeg, tolSidePct
      );
      squares.push(...sideBasedSquares);
      
      // Try diagonal-based construction if enabled
      if (searchDiagonals) {
        const diagonalBasedSquares = findDiagonalBasedSquares(
          p1, p2, curve, epsHit, tolAngleDeg, tolSidePct
        );
        squares.push(...diagonalBasedSquares);
      }
    }
  }
  
  return squares;
}

/**
 * Find squares using side-based construction
 * Given two points p1, p2 that form one side of a square,
 * find the other two vertices by rotating perpendicular vectors
 */
function findSideBasedSquares(
  p1: Point,
  p2: Point,
  curve: Curve,
  epsHit: number,
  tolAngleDeg: number,
  tolSidePct: number
): Square[] {
  const squares: Square[] = [];
  
  // Calculate side vector
  const sideVector = { x: p2.x - p1.x, y: p2.y - p1.y };
  const sideLength = Math.sqrt(sideVector.x * sideVector.x + sideVector.y * sideVector.y);
  
  if (sideLength === 0) return squares;
  
  // Normalize the side vector
  const normalizedSide = { x: sideVector.x / sideLength, y: sideVector.y / sideLength };
  
  // Calculate perpendicular vector (rotated 90°)
  const perpVector = { x: -normalizedSide.y, y: normalizedSide.x };
  
  // Try both directions for the perpendicular
  for (const direction of [1, -1]) {
    const perp = { 
      x: direction * perpVector.x * sideLength, 
      y: direction * perpVector.y * sideLength 
    };
    
    // Calculate the other two vertices
    const p3 = { x: p2.x + perp.x, y: p2.y + perp.y };
    const p4 = { x: p1.x + perp.x, y: p1.y + perp.y };
    
    // Check if p3 and p4 lie on the curve within tolerance
    const hit3 = findClosestPointOnCurve(p3, curve, epsHit);
    const hit4 = findClosestPointOnCurve(p4, curve, epsHit);
    
    if (hit3 && hit4) {
      const square = validateSquare([p1, p2, hit3.foot, hit4.foot], tolAngleDeg, tolSidePct);
      if (square) {
        squares.push(square);
      }
    }
  }
  
  return squares;
}

/**
 * Find squares using diagonal-based construction
 * Given two points p1, p2 that form a diagonal of a square,
 * find the other two vertices by rotating around the center
 */
function findDiagonalBasedSquares(
  p1: Point,
  p2: Point,
  curve: Curve,
  epsHit: number,
  tolAngleDeg: number,
  tolSidePct: number
): Square[] {
  const squares: Square[] = [];
  
  // Calculate diagonal vector and length
  const diagonalVector = { x: p2.x - p1.x, y: p2.y - p1.y };
  const diagonalLength = Math.sqrt(diagonalVector.x * diagonalVector.x + diagonalVector.y * diagonalVector.y);
  
  if (diagonalLength === 0) return squares;
  
  // Calculate center point
  const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  
  // Calculate half-diagonal vector
  const halfDiagonal = { x: diagonalVector.x / 2, y: diagonalVector.y / 2 };
  
  // Calculate perpendicular to diagonal (rotated 90°)
  const perpVector = { x: -halfDiagonal.y, y: halfDiagonal.x };
  
  // Try both directions for the perpendicular
  for (const direction of [1, -1]) {
    const perp = { 
      x: direction * perpVector.x, 
      y: direction * perpVector.y 
    };
    
    // Calculate the other two vertices
    const p3 = { x: center.x + perp.x, y: center.y + perp.y };
    const p4 = { x: center.x - perp.x, y: center.y - perp.y };
    
    // Check if p3 and p4 lie on the curve within tolerance
    const hit3 = findClosestPointOnCurve(p3, curve, epsHit);
    const hit4 = findClosestPointOnCurve(p4, curve, epsHit);
    
    if (hit3 && hit4) {
      const square = validateSquare([p1, p2, hit3.foot, hit4.foot], tolAngleDeg, tolSidePct);
      if (square) {
        squares.push(square);
      }
    }
  }
  
  return squares;
}

/**
 * Find the closest point on the curve to a given point
 */
function findClosestPointOnCurve(point: Point, curve: Curve, maxDist: number): ProjectionResult | null {
  let closestDist = Infinity;
  let closestResult: ProjectionResult | null = null;
  
  for (let i = 0; i < curve.length; i++) {
    const p1 = curve[i];
    const p2 = curve[(i + 1) % curve.length];
    
    const result = projectPointToSegment(point, p1, p2);
    if (result.dist < closestDist) {
      closestDist = result.dist;
      closestResult = result;
    }
  }
  
  return closestDist <= maxDist ? closestResult : null;
}

/**
 * Validate that four points form a valid square
 */
function validateSquare(
  vertices: [Point, Point, Point, Point],
  tolAngleDeg: number,
  tolSidePct: number
): Square | null {
  const [p1, p2, p3, p4] = vertices;
  
  // Calculate side lengths
  const sides = [
    distance(p1, p2),
    distance(p2, p3),
    distance(p3, p4),
    distance(p4, p1)
  ];
  
  // Check side length uniformity
  const avgSide = sides.reduce((sum, side) => sum + side, 0) / 4;
  if (avgSide === 0) return null; // Avoid division by zero
  
  const maxSideDeviation = Math.max(...sides.map(side => Math.abs(side - avgSide) / avgSide));
  
  if (maxSideDeviation > tolSidePct / 100) {
    return null;
  }
  
  // Check angles (should be 90°)
  const angles = [
    angleBetweenVectors({ x: p2.x - p1.x, y: p2.y - p1.y }, { x: p4.x - p1.x, y: p4.y - p1.y }),
    angleBetweenVectors({ x: p3.x - p2.x, y: p3.y - p2.y }, { x: p1.x - p2.x, y: p1.y - p2.y }),
    angleBetweenVectors({ x: p4.x - p3.x, y: p4.y - p3.y }, { x: p2.x - p3.x, y: p2.y - p3.y }),
    angleBetweenVectors({ x: p1.x - p4.x, y: p1.y - p4.y }, { x: p3.x - p4.x, y: p3.y - p4.y })
  ];
  
  const maxAngleDeviation = Math.max(...angles.map(angle => Math.abs(angle - 90)));
  
  if (maxAngleDeviation > tolAngleDeg) {
    return null;
  }
  
  // Calculate square properties
  const sideLength = avgSide;
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  
  return {
    id: generateSquareId(vertices),
    vertices: [p1, p2, p3, p4],
    side: sideLength,
    angle: angle
  };
}

/**
 * Generate a unique ID for a square based on its vertices
 */
function generateSquareId(vertices: [Point, Point, Point, Point]): string {
  // Calculate centroid
  const centroid = {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / 4,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / 4
  };
  
  // Normalize vertices relative to centroid
  const normalized = vertices.map(v => ({
    x: v.x - centroid.x,
    y: v.y - centroid.y
  }));
  
  // Sort vertices by angle to ensure consistent ordering
  normalized.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
  
  // Create hash
  const hash = normalized.map(v => 
    `${Math.round(v.x * 100)}_${Math.round(v.y * 100)}`
  ).join('_');
  
  return hash;
}
