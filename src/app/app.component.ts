
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { YardBay } from './model/yard-bay';
import { CtMockService } from '../../mock/ct-mock.service';
import { YardposInfo } from './model/yardpos-info';
import { RenderOptions } from './model/render-options';
import { CtYardComponent } from './ct-yard/ct-yard/ct-yard.component';


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

export class AppComponent implements OnInit {
  blockLocations = [];
  blocks: YardposInfo[][] = [];
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
  };

  @ViewChildren(CtYardComponent) yardComponents: QueryList<CtYardComponent>;

  renderOptions: RenderOptions<YardposInfo>;
  constructor(private mock: CtMockService) {

  }

  ngOnInit() {
    this.mock.getYardposInfoList().subscribe((blockLocations) => {
      this.blockLocations = blockLocations;
      this.blocks[0] = [...this.blockLocations]
      console.log();
      setTimeout(() => {
        const location = this.blockLocations.find(p => p.yardpos === '*4D0060101');
        location.container = this.blockLocations[50].container;
        // this.blockLocations[50].container = null;
        this.yardComponents.last.extractBasicInfo();
        this.yardComponents.last.processData();
        this.yardComponents.last.redraw();
        // this.blockLocations = [...this.blockLocations];
        // this.blocks[0] = [...this.blocks[0]];
      }, 2000);

      setTimeout(() => {
        const location = this.blockLocations.find(p => p.yardpos === '*4D0060102');
        location.container = this.blockLocations[50].container;
        // this.blockLocations[50].container = null;
        // this.yardComponents.last.extractBasicInfo();
        // this.yardComponents.last.processData();
        this.yardComponents.last.redraw();
        // this.blockLocations = [...this.blockLocations];
        // this.blocks[0] = [...this.blocks[0]];
      }, 4000);
      // setTimeout(() => {
      //   this.renderOptions = {
      //     fill: 'red'
      //   };
      // }, 2000);

    });
  }

}

