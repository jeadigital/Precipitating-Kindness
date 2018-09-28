import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomerequestComponent } from './homerequest.component';

describe('HomerequestComponent', () => {
  let component: HomerequestComponent;
  let fixture: ComponentFixture<HomerequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomerequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
