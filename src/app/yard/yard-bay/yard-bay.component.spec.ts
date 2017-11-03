/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { YardBayComponent } from './yard-bay.component';

describe('YardBayComponent', () => {
  let component: YardBayComponent;
  let fixture: ComponentFixture<YardBayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardBayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
