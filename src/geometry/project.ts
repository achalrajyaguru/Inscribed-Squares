import { Point, ProjectionResult } from './types';

/**
 * Project a point onto a line segment and return distance, parameter, and foot point
 */
export function projectPointToSegment(p: Point, a: Point, b: Point): ProjectionResult {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  
  // Handle degenerate case where segment has zero length
  if (lengthSquared === 0) {
    const dist = Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
    return { dist, t: 0, foot: a };
  }
  
  // Calculate parameter t
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
  
  // Calculate foot point
  const foot: Point = {
    x: a.x + t * dx,
    y: a.y + t * dy
  };
  
  // Calculate distance
  const dist = Math.sqrt((p.x - foot.x) ** 2 + (p.y - foot.y) ** 2);
  
  return { dist, t, foot };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * Calculate angle between two vectors in degrees
 */
export function angleBetweenVectors(v1: Point, v2: Point): number {
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  const cosAngle = dot / (mag1 * mag2);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  return Math.acos(clampedCos) * (180 / Math.PI);
}

/**
 * Rotate a point around another point by given angle in degrees
 */
export function rotatePoint(point: Point, center: Point, angleDeg: number): Point {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos
  };
}
