export interface Point {
  x: number;
  y: number;
}

export interface DrawingEvent {
  type: 'draw' | 'erase'
  points: Point[];
  color: string;
  lineWidth: number;
  userId: string;
  timestamp: number;
  lineId: string;
}

export interface CanvasState {
  events: DrawingEvent[];
  version: number;
}

export interface DrawingTool {
  type: 'draw' | 'erase'
  color: string;
  lineWidth: number;
}
