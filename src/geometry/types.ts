export type Point = { x: number; y: number };

export type Polyline = Point[];

export type Curve = Point[];

export type Square = {
  id: string;
  vertices: [Point, Point, Point, Point];
  side: number;
  angle: number;
};

export type ProjectionResult = {
  dist: number;
  t: number;
  foot: Point;
};

export type SquareSearchOptions = {
  epsHit?: number;
  tolAngleDeg?: number;
  tolSidePct?: number;
  searchDiagonals?: boolean;
};

export type CanvasState = {
  points: Point[];
  isClosed: boolean;
  squares: Square[];
  isDrawing: boolean;
};

export type ToastMessage = {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
};
