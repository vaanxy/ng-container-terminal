import { Component, Input, OnInit } from '@angular/core';
import { Cell, Prestow, Container, BayInfo, BayInfoGroup, VesselBasicInfo, PrestowDigest } from '../shared';
import { CtVesselService } from './ct-vessel.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-ct-vessel',
  templateUrl: './ct-vessel.component.html',
  styleUrls: ['./ct-vessel.component.css']
})
export class CtVesselComponent implements OnInit {
  @Input() vesType: string;
  private vessel: Cell[];
  private prestows: Prestow[];
  private containers: Container[];
  private prestowDigest: PrestowDigest;
  private bayList: BayInfoGroup[];
  private bayDisplayList: BayInfoGroup[];
  private vesselBasicInfo: VesselBasicInfo;

  constructor(private vesselService: CtVesselService) {

  }

  ngOnInit() {
    this.vessel = this.vesselService.getVessel(this.vesType);
    this.prestows = this.vesselService.getPrestow('P1604260001');
    this.containers = this.vesselService.getContainer('P1604260001');
    this.prestowDigest = this.getPrestowDigest(this.prestows);
    console.log(this.prestowDigest);
    this.vesselBasicInfo = this.getVesselBasicInfo();
    this.bayList = this.getBayList(this.vessel);
    this.bayDisplayList = [].concat(this.bayList);
    console.log(this.bayDisplayList);
    // setInterval(() => this.bayDisplayList.pop(), 1000);
  }

  getVesselBasicInfo(cells?: Cell[]): VesselBasicInfo {
    return new VesselBasicInfo();
  }

  getBayList(cells: Cell[]): BayInfoGroup[] {
    let bayNoSet: d3.Set;
    let bayNoWithoutDHSet: d3.Set;
    let bayInfoList: BayInfo[];

    bayNoSet = d3.set(cells, cell => cell.name.slice(0, 4));
    bayNoWithoutDHSet = d3.set(cells, cell => cell.name.slice(0, 3));
    bayInfoList =
      bayNoSet.values().map(bayNo => {
          let supply00: number = (
            cells
              .filter(cell => cell.name.indexOf(bayNo) !== -1)
              .some(cell => cell.name.slice(4, 6) === '00') ? 0 : 1
          );
          return new BayInfo(bayNo, supply00);
      });

    return bayNoWithoutDHSet.values().map(bayNoWithoutDH => {
      let deck: BayInfo;
      let hold: BayInfo;
      deck = bayInfoList.filter(bayInfo => bayInfo.name === (bayNoWithoutDH + 'D'))[0];
      hold = bayInfoList.filter(bayInfo => bayInfo.name === (bayNoWithoutDH + 'H'))[0];
      return new BayInfoGroup(bayNoWithoutDH, deck, hold);
    });
  }

  getPrestow(bayName: string): Prestow[] {
    return this.prestows.filter(p => {
      return p.cell.slice(0, 3) === bayName ||
        parseInt(p.cell.slice(0, 3), 10) - 1 === parseInt(bayName.slice(0, 3), 10) ||
        parseInt(p.cell.slice(0, 3), 10) + 1 === parseInt(bayName.slice(0, 3), 10);
    });
  }

  getPrestowDigest(prestows: Prestow[]): PrestowDigest {
    let pods, groups, group2s: string[];
    pods = d3.set(prestows, (p) => p.pod).values();
    groups = d3.set(prestows, (p) => p.group).values();
    group2s = d3.set(prestows, (p) => p.group2).values();
    return {
      pods: pods,
      groups: groups,
      group2s: group2s,
    };
  }

  filterBay(cells: Cell[]): void {
    let filteredCells: Cell[];
    filteredCells = cells.filter(cell => {
      return cell.name.slice(0, 3) === '002';
    });
    this.bayDisplayList = this.getBayList(filteredCells);
    // return this.getBayList(filteredCells);
  }

  // filterBayByPrestow(prestows: Prestow[]): void {
  //   let filteredCells: Cell[];
  //   let filtered;
  //   filtered = prestows.filter(prestow => {
  //     return prestow.pod === this.prestowDigest.pods[0];
  //   }).map(p => p.cell);
  //   // console.log(filtered);

  //   filteredCells = this.vessel.filter(cell => {
  //     return filtered.indexOf(cell.name) !== -1;
  //   });
  //   this.bayDisplayList = this.getBayList(filteredCells);
  //   // return this.getBayList(filteredCells);
  // }
  getShadowBay(bayName: string) {
    let bayNo: number;
    let pods, bays: string[];
    bayNo = parseInt(bayName.slice(0, 3), 10);
    pods = d3.set(
      this.prestows.filter(p => {
        return parseInt(p.cell.slice(0, 3), 10) === bayNo ||
          parseInt(p.cell.slice(0, 3), 10) + 1 === bayNo ||
          parseInt(p.cell.slice(0, 3), 10) - 1 === bayNo;
      }),
      p => p.pod
    ).values();

    bays = d3.set(
      this.prestows.filter(p => pods.indexOf(p.pod) !== -1),
      p => p.cell.slice(0, 3)

    ).values();
    this.bayDisplayList = this.bayList.filter(b => bays.indexOf(b.name) !== -1);




  }

}
