
import { Component, OnInit } from '@angular/core';


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { YardBay } from './model/yard-bay';
import { CtMockService } from '../../mock/src/ct-mock.service';
import { YardposInfo } from './model/yardpos-info';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('expandInAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        }),
        animate('300ms ease-in')
      ]),
    ]),
    trigger('shrinkOutAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'scaleY(1)',
        })
      ),
      transition(':leave', [
        animate('300ms ease-out', style({
          opacity: 0,
          transform: 'scale(0.8)',
        }))
      ])
    ])
  ]
})

export class AppComponent {
  blockLocations = [];
  yardBay: YardBay = {
    name: 'a',
    maxRow: 6,
    maxTier: 4,
    yardposInfoArray: [{
      yardpos: '*1A0010202',
      container: null,
      tasks: [],
      plans: [],
      isLocked: false
    },
    {
    yardpos: '*1A0010203',
    container: null,
    tasks: [],
    plans: [],
    isLocked: true
  }]
  }
  constructor(private mock: CtMockService) {
    this.mock.getYardposInfoList().subscribe((blockLocations) => {
      this.blockLocations = blockLocations;
    });
  }

}

