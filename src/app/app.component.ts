import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Prestow, RenderOptions, Vescell, YardBay, YardInfo, Yardpos, YardposInfo } from 'ng-container-terminal/core';
import { CtMockService } from 'ng-container-terminal/mock';
import { CtVescellParserService } from 'ng-container-terminal/tool';
import { CtYardComponent } from 'ng-container-terminal/yard';

import { AppService } from './app.service';

export const prestows: Vescell<any>[] = [
  {
    data: null,
    name: '001D0182'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0184'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0186'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0188'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0282'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0284'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0286'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0288'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0382'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0384'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0386'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0388'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0482'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0484'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0486'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0488'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0582'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0584'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0586'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0588'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0682'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0684'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0686'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0688'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0782'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0784'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0786'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0788'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0882'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0884'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0886'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0888'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0982'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0984'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0986'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D0988'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D1082'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D1084'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D1086'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001D1088'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0112'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0114'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0116'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0118'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0212'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0214'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0216'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0218'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0316'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0318'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0416'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0418'
  },
  {
    data: {
      ctnGroup: null,
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0518'
  },
  {
    data: {
      ctnGroup: '666',
      ctnGroup2: null,
      ctnSize: null,
      pod: null,
      vesCode: 'APL SING'
    },
    name: '001H0618'
  }
];

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
  blockLocations: YardposInfo[] = [];
  yardInfoList: YardInfo<any>[] = [];
  blocks: YardposInfo[][] = [];
  // vesselBay: VesselBay<any>;
  // vesselBays: VesselBay<any>[] = [];
  vescellsList: Vescell<Prestow>[][] = [];
  vescells: Vescell<Prestow>[] = [];

  yardBay: YardBay<string> = {
    name: '*1A063',
    poses: [{ name: '*1A0630101', data: '666' }, { name: '*1A0630102', data: '666' }]
  };

  yardBayRenderOptions: RenderOptions<Yardpos<any>> = {
    text: d => (d.data ? '10.2' : ''),
    stroke: d => {
      return 'green';
    },
    strokeWidth: 2
  };

  rotation = 0;

  vescellSize = 20;

  @ViewChildren(CtYardComponent) yardComponents: QueryList<CtYardComponent>;

  vesselRenderOptions: RenderOptions<Vescell<Prestow>>;
  yardOverviewRenderOptions: RenderOptions<YardInfo<any>> = {
    scaleFactor: 0.3,
    stroke: 'grey',
    strokeWidth: 6
  };

  cellTrackByFn = (cell: Vescell<Prestow>) => {
    return cell.name + (cell.data ? cell.data.height : '');
  };
  constructor(private mock: CtMockService, private app: AppService, private cellParser: CtVescellParserService) {}

  ngOnInit() {
    this.getPrestows();
    // setTimeout(() => {
    //   console.log('vessel bay');
    //   // this.vescellSize = 20;
    //   // this.vesselBay.vescells.pop();
    //   this.vesselBay.frontCells[0].data = 1111;
    //   this.vesselBay = Object.assign({}, this.vesselBay);
    // }, 2000);

    this.mock.getYardposInfoList().subscribe(blockLocations => {
      blockLocations = blockLocations.filter(l => l.displayedContainer || l.isLocked);
      blockLocations = this.app.yardposCompletion(blockLocations, {
        block: '*4D',
        maxBay: 40,
        maxRow: 6,
        maxTier: 5,
        x: 0,
        y: 0,
        direction: 'H',
        width: 0,
        height: 0
      });
      this.blockLocations = blockLocations;

      this.blocks[0] = [...this.blockLocations];

      setTimeout(() => {
        this.rotation = 90;
      }, 2000);
      setTimeout(() => {
        const location = this.blockLocations.find(p => p.yardpos === '*4D0060101');
        location.containers = this.blockLocations[50].containers;
        location.displayedContainer = this.blockLocations[50].displayedContainer;
        // 修改组件@Input字段的内部属性，需要手动通知组件刷新
        this.yardComponents.first.notifyDataUpdated();
      }, 2000);
    });

    this.mock.getYardInfoList().subscribe((yardInfoList: YardInfo<any>[]) => {
      this.yardInfoList = yardInfoList;
      setTimeout(() => {
        this.yardInfoList = yardInfoList.slice(0, 10);
        this.yardOverviewRenderOptions = {
          scaleFactor: 0.5,
          stroke: 'red',
          fill: 'green',
          strokeWidth: 10
        };
      }, 6000);
    });
  }

  onYardClicked(yardInfo: YardInfo<any>) {
    this.yardInfoList = [...this.yardInfoList];
    console.log(yardInfo);
  }

  renderYardContent($event: { node: d3.Selection<any, any, any, any>; data: YardInfo<any> }) {
    console.log('renderYardContent');
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

  getPrestows() {
    const cellMap: { [key: string]: Vescell<any> } = {};
    const bayMap: { [key: string]: Vescell<any>[] } = {};
    this.app.getPrestow().subscribe(cells => {
      // setTimeout(() => {
      //   // this.vesselRenderOptions = {
      //   //   fill: 'green'
      //   // };

      //   // this.vesselBays[0] = {
      //   //   name: '001',
      //   //   vescells: this.vesselBays[0].vescells
      //   // };
      //   this.vescellSize = 40;
      // }, 3000);
      cells.forEach(cell => {
        cellMap[cell.name] = cell;
        const bayName = this.cellParser.getBayno(cell.name);
        // console.log(bayName);

        if (bayMap[bayName]) {
          bayMap[bayName].push(cell);
        } else {
          bayMap[bayName] = [cell];
        }
      });
      const vcells: Vescell<Prestow>[][] = [];
      Object.entries(bayMap).forEach(([bayName, arr]) => {
        vcells.push(arr);
      });
      this.vescellsList = vcells;
      const timer = setInterval(() => {
        console.log(this.vescellsList[0].length);
        const idx = Math.floor(Math.random() * 3);
        this.vesselRenderOptions = {
          // fill: ['green', 'blue', 'red', 'yellow', 'orange'][idx],
          text: v => {
            return v.data ? v.data.height : '';
          }
        };
        // if (this.vescellsList[0].length) {
        //   this.vescellsList[0] = this.vescellsList[0].slice(1, this.vescellsList[0].length);
        // } else {
        //   clearInterval(timer);
        // }
        const randIdx = Math.floor(Math.random() * this.vescellsList.length);
        this.vescells = this.vescellsList[randIdx];
        // this.vescells = this.vescellsList[0];

        // this.vescellSize = Math.max(0, Math.random() * 40);
      }, 1001);
    });
  }

  yardposClick($event: YardposInfo) {
    console.log($event);
  }
}
