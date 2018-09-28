import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofhouserequestforbidapprovalComponent } from './listofhouserequestforbidapproval.component';

describe('ListofhouserequestforbidapprovalComponent', () => {
  let component: ListofhouserequestforbidapprovalComponent;
  let fixture: ComponentFixture<ListofhouserequestforbidapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListofhouserequestforbidapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofhouserequestforbidapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
