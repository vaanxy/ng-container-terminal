import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardCanvasComponent } from './yard-canvas.component';

describe('YardCanvasComponent', () => {
  let component: YardCanvasComponent;
  let fixture: ComponentFixture<YardCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
