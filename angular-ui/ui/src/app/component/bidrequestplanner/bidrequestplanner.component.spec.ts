import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidrequestplannerComponent } from './bidrequestplanner.component';

describe('BidrequestplannerComponent', () => {
  let component: BidrequestplannerComponent;
  let fixture: ComponentFixture<BidrequestplannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidrequestplannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidrequestplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
