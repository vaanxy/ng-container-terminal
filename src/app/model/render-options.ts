export interface RenderOptions<T> {
    fill: ((data: T) => string) | string;
}
