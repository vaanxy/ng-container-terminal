import { BayInfo } from './';
export class BayInfoGroup {
  name: string;
  deck: BayInfo;
  hold: BayInfo;

  constructor(name: string, deck?: BayInfo, hold?: BayInfo) {
    this.name = name;
    this.deck = deck;
    this.hold = hold;
  }
}
