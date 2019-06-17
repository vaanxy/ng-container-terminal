import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CtYardComponent, RenderOptions, YardBay, YardInfo, YardposInfo } from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('expandInAnimation', [
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scale(1)'
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.8)'
        }),
        animate('300ms ease-in')
      ])
    ]),
    trigger('shrinkOutAnimation', [
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scaleY(1)'
        })
      ),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({
            opacity: 0,
            transform: 'scale(0.8)'
          })
        )
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  blockLocations = [];
  yardInfoList: YardInfo<any>[] = [];
  blocks: YardposInfo[][] = [];
  // yardBay: YardBay = {
  //   name: 'a',
  //   maxRow: 6,
  //   maxTier: 4,
  //   yardposInfoArray: [
  //     {
  //       yardpos: '*1A0010202',
  //       displayedContainer: null,
  //       containers: [],
  //       plans: [],
  //       isLocked: false
  //     },
  //     {
  //       yardpos: '*1A0010203',
  //       displayedContainer: null,
  //       containers: [],
  //       plans: [],
  //       isLocked: true
  //     }
  //   ]
  // };

  yardBay: YardBay<string> = {
    name: '*1A063',
    poses: [
      { name: '*1A0630101', data: '666' },
      { name: '*1A0630102', data: '666' }
    ]
  };

  rotation = 0;

  @ViewChildren(CtYardComponent) yardComponents: QueryList<CtYardComponent>;

  renderOptions: RenderOptions<YardposInfo>;
  yardOverviewRenderOptions: RenderOptions<YardInfo<any>> = {
    scaleFactor: 0.3,
    stroke: 'green',
    strokeWidth: 6
  };
  constructor(private mock: CtMockService) {}

  ngOnInit() {
    this.mock.getYardposInfoList().subscribe(blockLocations => {
      this.blockLocations = blockLocations;
      this.blocks[0] = [...this.blockLocations];
      setTimeout(() => {
        const location = this.blockLocations.find(
          p => p.yardpos === '*4D0060101'
        );
        location.container = this.blockLocations[50].container;
        this.yardComponents.last.notifyDataUpdated();
      }, 2000);

      setTimeout(() => {
        this.rotation = 90;
        const location = this.blockLocations.find(
          p => p.yardpos === '*4D0060102'
        );
        location.container = this.blockLocations[50].container;
        this.yardComponents.last.notifyDataUpdated(true);
        // setTimeout(() => {
        //   this.yardComponents.first.redraw();
        //   this.yardComponents.last.redraw();
        // }, 0);
      }, 4000);
    });

    this.mock.getYardInfoList().subscribe((yardInfoList: YardInfo<any>[]) => {
      this.yardInfoList = yardInfoList;
    });
  }

  onYardClicked(yardInfo: YardInfo<any>) {
    console.log(yardInfo);
  }

  renderYardContent($event: {
    node: d3.Selection<any, any, any, any>;
    data: YardInfo<any>;
  }) {
    const { node, data } = $event;
    node
      .append('rect')
      .attr('width', 10)
      .attr('height', data.height)
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-width', '2px')
      // .attr('transform', `translate(${index * pieceWidth}, 0)`)
      .attr('fill', 'red');
  }
}
