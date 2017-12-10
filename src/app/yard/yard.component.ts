import { YardBay } from '../model/yard-bay';

import { Yard } from '../model/yard';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-yard',
  templateUrl: './yard.component.html',
  styleUrls: ['./yard.component.css']
})
export class YardComponent implements OnInit {

  @Input() yard: Yard = {
    name: '',
    yardBays: [],
    direction: 'H',
    maxBay: 0,
    maxRow: 6,
    maxTier: 4
  };
  // 记录最原始的yardBay数组，用于过滤使用
  rawYardBays: YardBay[] = [];


  constructor() { }

  ngOnInit() {
    this.rawYardBays = [...this.yard.yardBays];

  }

  findYardBays(cb: (yardBay: YardBay) => boolean) {
    this.yard.yardBays = this.rawYardBays.filter(cb);
  }


  onYardPosInfoClicked() {
    // alert(container.no);
  }
}
