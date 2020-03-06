import { RenderOptions } from '../model/render-options';

export interface Renderable<T> {
  defaultRenderOptions: RenderOptions<T>;
  renderOptions: RenderOptions<T>;
  render: (prop: string, target: T) => string | number;
}
