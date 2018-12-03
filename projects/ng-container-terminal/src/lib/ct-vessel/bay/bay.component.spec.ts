/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BayComponent } from './bay.component';

describe('BayComponent', () => {
  let component: BayComponent;
  let fixture: ComponentFixture<BayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
