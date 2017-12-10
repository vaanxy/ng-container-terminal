import { Yard } from '../../model/yard';
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-yard-bay-canvas',
  templateUrl: './yard-bay-canvas.component.html',
  styleUrls: ['./yard-bay-canvas.component.css']
})
export class YardBayCanvasComponent implements OnInit {
  @Input() yards: Yard[] = [];

  constructor() { }

  public ngOnInit(): void {
    // d3.csv('../assets/test_data.csv', (d: Array<any>) => {
    //   this.yardNames = d3.set(d.map(data => data.location.slice(0, 3))).values();
    //   this.containers = d.map(data => {
    //     return {
    //       pid: 'test',
    //       no: data.no,
    //       location: data.location.slice(0, 3) + data.location.slice(4, 8) + data.location.slice(9, 10),
    //       size: data.size_type.slice(0, 2),
    //       type: data.size_type.slice(2, 4),
    //       height: 'GP',
    //       pod: data.pod,
    //       group: 'group1',
    //       group2: 'group2',
    //       weight: data.weight / 1000.0,
    //     };
    //   });
    //   console.log(this.containers);
    // });
  }
  getContainers(yardName: string) {
    // return this.containers.filter(c =>  c.location.slice(0, 3) === yardName);
  }

}
