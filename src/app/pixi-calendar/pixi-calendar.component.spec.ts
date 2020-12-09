import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PixiCalendarComponent } from './pixi-calendar.component';

describe('PixiCalendarComponent', () => {
  let component: PixiCalendarComponent;
  let fixture: ComponentFixture<PixiCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PixiCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PixiCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
