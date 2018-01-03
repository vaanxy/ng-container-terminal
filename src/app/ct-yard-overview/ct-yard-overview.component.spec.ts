import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtYardOverviewComponent } from './ct-yard-overview.component';

describe('CtYardOverviewComponent', () => {
  let component: CtYardOverviewComponent;
  let fixture: ComponentFixture<CtYardOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtYardOverviewComponent ]
    })
    .compileComponents();
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
