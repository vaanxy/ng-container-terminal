/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CtVesselComponent } from './ct-vessel.component';

describe('CtVesselComponent', () => {
  let component: CtVesselComponent;
  let fixture: ComponentFixture<CtVesselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtVesselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtVesselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
