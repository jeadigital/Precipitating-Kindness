import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannershomepageComponent } from './plannershomepage.component';

describe('PlannershomepageComponent', () => {
  let component: PlannershomepageComponent;
  let fixture: ComponentFixture<PlannershomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannershomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannershomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
