import { Point, Polyline, Curve } from './types';

/**
 * Resample a closed polyline to M points uniformly distributed by arc length
 */
export function resampleClosed(poly: Polyline, M: number = 300): Curve {
  if (poly.length < 2) return poly;
  
  // Calculate cumulative arc lengths
  const arcLengths: number[] = [0];
  for (let i = 1; i < poly.length; i++) {
    const prev = poly[i - 1];
    const curr = poly[i];
    const dist = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
    arcLengths.push(arcLengths[i - 1] + dist);
  }
  
  // Close the loop by adding distance from last to first point
  const lastPoint = poly[poly.length - 1];
  const firstPoint = poly[0];
  const closingDist = Math.sqrt((firstPoint.x - lastPoint.x) ** 2 + (firstPoint.y - lastPoint.y) ** 2);
  const totalLength = arcLengths[arcLengths.length - 1] + closingDist;
  
  // Generate M uniformly spaced points
  const result: Curve = [];
  for (let i = 0; i < M; i++) {
    const targetLength = (i / (M - 1)) * totalLength;
    result.push(interpolateAtLength(poly, arcLengths, targetLength));
  }
  
  return result;
}

/**
 * Interpolate a point at a given arc length along the polyline
 */
function interpolateAtLength(poly: Polyline, arcLengths: number[], targetLength: number): Point {
  // Handle edge cases
  if (targetLength <= 0) return poly[0];
  if (targetLength >= arcLengths[arcLengths.length - 1]) {
    // For closed curves, interpolate back to start
    const lastPoint = poly[poly.length - 1];
    const firstPoint = poly[0];
    const excessLength = targetLength - arcLengths[arcLengths.length - 1];
    const totalClosingDist = Math.sqrt((firstPoint.x - lastPoint.x) ** 2 + (firstPoint.y - lastPoint.y) ** 2);
    
    if (totalClosingDist === 0) return firstPoint;
    
    const t = excessLength / totalClosingDist;
    return {
      x: lastPoint.x + t * (firstPoint.x - lastPoint.x),
      y: lastPoint.y + t * (firstPoint.y - lastPoint.y)
    };
  }
  
  // Find the segment containing the target length
  for (let i = 0; i < arcLengths.length - 1; i++) {
    if (targetLength >= arcLengths[i] && targetLength <= arcLengths[i + 1]) {
      const segmentLength = arcLengths[i + 1] - arcLengths[i];
      if (segmentLength === 0) return poly[i];
      
      const t = (targetLength - arcLengths[i]) / segmentLength;
      const p1 = poly[i];
      const p2 = poly[i + 1];
      
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      };
    }
  }
  
  // Fallback
  return poly[poly.length - 1];
}
