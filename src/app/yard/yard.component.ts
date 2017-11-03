import { Observable } from 'rxjs/Rx';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CtVesselService } from '../ct-vessel/ct-vessel.service';
import { Container } from '../shared';
import * as d3 from 'd3';

@Component({
  selector: 'app-yard',
  templateUrl: './yard.component.html',
  styleUrls: ['./yard.component.css']
})
export class YardComponent implements OnInit {

  private containers: Container[] = [];

  @Input() yardName: string = '***';
  @Input()
  set inputContainers(inputContainers: Container[]) {
    this.containers = [...inputContainers];
    this.yardBayNames = d3.set(this.containers, (container: Container) => container.location.slice(0, 5)).values();
  }

  yardBayNames: string[];
  size = [6, 4];



  constructor(private vesselService: CtVesselService) { }

  ngOnInit() {

  }


  getContainers(yardBayName: string): Container[] {
    return this.containers.filter(c =>  c.location.slice(0, 5) === yardBayName);
  }

  onContainerClicked(container: Container) {
    alert(container.no);
  }
}
