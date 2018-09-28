import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouserequestlistforplanapprovalComponent } from './houserequestlistforplanapproval.component';

describe('HouserequestlistforplanapprovalComponent', () => {
  let component: HouserequestlistforplanapprovalComponent;
  let fixture: ComponentFixture<HouserequestlistforplanapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouserequestlistforplanapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouserequestlistforplanapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
