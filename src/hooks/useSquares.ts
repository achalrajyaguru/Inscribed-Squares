import { useCallback } from 'react';
import { Curve, Square } from '../geometry/types';
import { resampleClosed } from '../geometry/resample';
import { findInscribedSquares } from '../geometry/squares';
import { dedupeSquares } from '../geometry/dedupe';

export function useSquares() {
  const generateSquares = useCallback((points: any[]): Square[] => {
    if (points.length < 40) {
      throw new Error('Closed loop required with at least 40 points');
    }

    // Resample curve to M=300 points uniformly by arc length
    const resampledCurve: Curve = resampleClosed(points, 300);
    
    // Find all inscribed squares
    const squares = findInscribedSquares(resampledCurve, {
      epsHit: 5,
      tolAngleDeg: 2,
      tolSidePct: 2,
      searchDiagonals: true
    });
    
    // Deduplicate and sort
    const deduplicatedSquares = dedupeSquares(squares);
    
    if (deduplicatedSquares.length === 0) {
      throw new Error('No squares detected on this curve');
    }
    
    return deduplicatedSquares;
  }, []);

  return {
    generateSquares
  };
}
