/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BayListComponent } from './bay-list.component';

describe('BayListComponent', () => {
  let component: BayListComponent;
  let fixture: ComponentFixture<BayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
