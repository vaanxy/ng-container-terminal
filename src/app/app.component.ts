import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {




  // vesType: string = 'OCL TOKY';
  // bayNo: string = '006';
  // bayList = ['002', '006', '010', '014', '018', '022', '026', '030', '034', '038', '042', '046', '050', '054', '058', '062', '066', '070', '074'];
  containers = [];
  yardNames: string[] = [];
  public ngOnInit(): void {
    d3.csv('../assets/test_data.csv', (d: Array<any>) => {
      // console.log(d);
      this.yardNames = d3.set(d.map(data => data.location.slice(0, 3))).values();
      this.containers = d.map(data => {
        return {
          pid: 'test',
          no: data.no,
          location: data.location.slice(0, 3) + data.location.slice(4, 8) + data.location.slice(9, 10),
          size: data.size_type.slice(0, 2),
          type: data.size_type.slice(2, 4),
          height: 'GP',
          pod: data.pod,
          group: 'group1',
          group2: 'group2',
          weight: data.weight / 1000.0,
        };
      });
      console.log(this.containers);
    });
  }
  getContainers(yardName: string) {
    return this.containers.filter(c =>  c.location.slice(0, 3) === yardName);
  }
}
