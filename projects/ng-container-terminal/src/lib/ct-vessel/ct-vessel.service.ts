import { Injectable } from '@angular/core';
import { Cell, Prestow, VesselContainer } from '../../model';

@Injectable()
export class CtVesselService {

  constructor() { }
  private containers: VesselContainer[] = [];
  private prestows: Prestow[] = [];
  private cells: Cell[] = [];

  getBay(bay: string): Cell[] {
    return this.cells.filter(cell => cell.name.slice(0, 4) === bay);

  }

  getPrestow(pid: string): Prestow[] {
    return this.prestows.filter(p => p.pid === pid);
  }

  getContainer(pid: string): VesselContainer[] {
    return this.containers.filter(c => c.pid === pid);
  }

  getVessel(vesType: string): Cell[] {
    return  this.cells;
  }

}
