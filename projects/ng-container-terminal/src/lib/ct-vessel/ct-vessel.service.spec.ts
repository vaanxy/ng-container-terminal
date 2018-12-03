/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CtVesselService } from './ct-vessel.service';

describe('CtVesselService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CtVesselService]
    });
  });

  it('should ...', inject([CtVesselService], (service: CtVesselService) => {
    expect(service).toBeTruthy();
  }));
});
