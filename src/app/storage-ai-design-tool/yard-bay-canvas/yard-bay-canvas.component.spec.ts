import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardBayCanvasComponent } from './yard-bay-canvas.component';

describe('YardBayCanvasComponent', () => {
  let component: YardBayCanvasComponent;
  let fixture: ComponentFixture<YardBayCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardBayCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardBayCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
