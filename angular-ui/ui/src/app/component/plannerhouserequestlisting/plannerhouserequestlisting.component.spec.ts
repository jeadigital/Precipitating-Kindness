import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerhouserequestlistingComponent } from './plannerhouserequestlisting.component';

describe('PlannerhouserequestlistingComponent', () => {
  let component: PlannerhouserequestlistingComponent;
  let fixture: ComponentFixture<PlannerhouserequestlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerhouserequestlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerhouserequestlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
