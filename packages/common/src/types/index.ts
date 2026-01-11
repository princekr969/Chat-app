export type ShapeType = 'rectangle' | 'circle' | 'line';

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface Rectangle {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  lineWidth: number;
}

export interface Circle {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  color: string;
  lineWidth: number;
}

export interface Line {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  lineWidth: number;
}

export type Shape = Rectangle | Circle | Line;