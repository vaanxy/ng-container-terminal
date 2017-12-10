import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardDetailCanvasComponent } from './yard-detail-canvas.component';

describe('YardDetailCanvasComponent', () => {
  let component: YardDetailCanvasComponent;
  let fixture: ComponentFixture<YardDetailCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardDetailCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardDetailCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
