import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorhomeComponent } from './surveyorhome.component';

describe('SurveyorhomeComponent', () => {
  let component: SurveyorhomeComponent;
  let fixture: ComponentFixture<SurveyorhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyorhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
