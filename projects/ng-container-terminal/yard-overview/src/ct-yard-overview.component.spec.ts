/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CtYardOverviewComponent } from './ct-yard-overview.component';

describe('CtVesselComponent', () => {
  let component: CtYardOverviewComponent<any>;
  let fixture: ComponentFixture<CtYardOverviewComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CtYardOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtYardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
