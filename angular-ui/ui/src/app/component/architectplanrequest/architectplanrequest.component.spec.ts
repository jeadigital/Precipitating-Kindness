import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectplanrequestComponent } from './architectplanrequest.component';

describe('ArchitectplanrequestComponent', () => {
  let component: ArchitectplanrequestComponent;
  let fixture: ComponentFixture<ArchitectplanrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchitectplanrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitectplanrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
