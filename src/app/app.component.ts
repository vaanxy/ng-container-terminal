import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CtMockService } from 'projects/ng-container-terminal/mock/src/public_api';
import { Vescell, Yardpos } from 'projects/ng-container-terminal/src/model';
import {
  CtVescellParserService,
  CtYardComponent,
  RenderOptions,
  VesselBay,
  YardBay,
  YardInfo,
  YardposInfo,
} from 'projects/ng-container-terminal/src/public_api';

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
  blockLocations = [];
  yardInfoList: YardInfo<any>[] = [];
  blocks: YardposInfo[][] = [];
  vesselBay: VesselBay<any>;
  vesselBays: VesselBay<any>[] = [];

  yardBay: YardBay<string> = {
    name: '*1A063',
    poses: [
      { name: '*1A0630101', data: '666' },
      { name: '*1A0630102', data: '666' }
    ]
  };

  yardBayRenderOptions: RenderOptions<Yardpos<any>> = {
    text: d => (d.data ? '10.2' : '')
  };

  rotation = 0;

  vescellSize = 20;

  @ViewChildren(CtYardComponent) yardComponents: QueryList<CtYardComponent>;

  renderOptions: RenderOptions<YardposInfo>;
  yardOverviewRenderOptions: RenderOptions<YardInfo<any>> = {
    scaleFactor: 0.3,
    stroke: 'green',
    strokeWidth: 6
  };
  constructor(
    private mock: CtMockService,
    private app: AppService,
    private cellParser: CtVescellParserService
  ) {}

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

  getPrestows() {
    const cellMap: { [key: string]: Vescell<any> } = {};
    const bayMap: { [key: string]: Vescell<any>[] } = {};
    this.app.getPrestow().subscribe(cells => {
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
      Object.entries(bayMap).forEach(([bayName, arr]) => {
        this.vesselBays.push({
          name: bayName,
          vescells: arr
        });
      });
    });
  }
}
