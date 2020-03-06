import { RenderOptions } from '../model/render-options';
import { Renderable } from './renderable';

export class RenderObject<T> implements Renderable<T> {
  defaultRenderOptions: RenderOptions<T>;
  renderOptions: RenderOptions<T>;
  render(prop: string, target: T) {
    if (this.renderOptions.hasOwnProperty(prop)) {
      // const element = object[key];
    }
    if (this.renderOptions && this.renderOptions[prop]) {
      switch (typeof this.renderOptions[prop]) {
        case 'string':
          return this.renderOptions[prop];
        case 'number':
          return `${this.renderOptions[prop]}`;
        default:
          return this.renderOptions[prop](target);
      }
    } else {
      return null;
    }
  }
}
