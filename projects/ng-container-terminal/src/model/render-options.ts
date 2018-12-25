export interface RenderOptions<T> {
  fill?: string | ((data: T) => string);
  scaleFactor?: number;
}
