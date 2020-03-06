export interface RenderOptions<T> {
  fill?: string | ((data: T) => string);
  stroke?: string | ((data: T) => string);
  strokeWidth?: number | ((data: T) => number);
  scaleFactor?: number;
  text?: string | ((data: T) => string);
}
