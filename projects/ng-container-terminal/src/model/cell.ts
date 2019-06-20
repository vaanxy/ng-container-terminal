export class Cell {
  vesType: string;
  name: string;
  xb?: string;
  hb?: string;
  supply00: number;

  constructor(vesType, name, xb, hb, supply00) {}
}

export interface Vescell<T> {
  name: string;
  pairName?: string;
  data: T;
}
