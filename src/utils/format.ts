import { Point } from '../geometry/types';

/**
 * Format a point to 2 decimal places
 */
export function formatPoint(point: Point): string {
  return `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
}

/**
 * Format a number to 2 decimal places
 */
export function formatNumber(num: number): string {
  return num.toFixed(2);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download canvas as PNG file
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
