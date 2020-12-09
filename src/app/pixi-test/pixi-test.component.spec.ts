import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PixiTestComponent } from './pixi-test.component';

describe('PixiTestComponent', () => {
  let component: PixiTestComponent;
  let fixture: ComponentFixture<PixiTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PixiTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PixiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
