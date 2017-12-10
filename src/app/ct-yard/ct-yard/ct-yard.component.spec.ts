import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtYardComponent } from './ct-yard.component';

describe('CtYardComponent', () => {
  let component: CtYardComponent;
  let fixture: ComponentFixture<CtYardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtYardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtYardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
