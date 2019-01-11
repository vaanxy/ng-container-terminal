export interface RenderOptions<T> {
  fill?: string | ((data: T) => string);
  stroke?: string | ((data: T) => string);
  strokeWidth?: string | ((data: T) => number);
  scaleFactor?: number;
}
