import { Square, Point } from './types';

/**
 * Deduplicate squares by centroid-normalized ordering and rounded hash
 */
export function dedupeSquares(squares: Square[]): Square[] {
  const seen = new Set<string>();
  const result: Square[] = [];
  
  for (const square of squares) {
    const hash = generateDedupeHash(square);
    if (!seen.has(hash)) {
      seen.add(hash);
      result.push(square);
    }
  }
  
  // Sort by side length descending
  return result.sort((a, b) => b.side - a.side);
}

/**
 * Generate a deduplication hash for a square
 */
function generateDedupeHash(square: Square): string {
  const vertices = square.vertices;
  
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
  
  // Round to 1e-2 precision
  const rounded = normalized.map(v => ({
    x: Math.round(v.x * 100) / 100,
    y: Math.round(v.y * 100) / 100
  }));
  
  // Create hash
  return rounded.map(v => `${v.x}_${v.y}`).join('_');
}
