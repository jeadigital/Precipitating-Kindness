import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerrequeststatusComponent } from './plannerrequeststatus.component';

describe('PlannerrequeststatusComponent', () => {
  let component: PlannerrequeststatusComponent;
  let fixture: ComponentFixture<PlannerrequeststatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerrequeststatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerrequeststatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
