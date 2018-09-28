import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallaccrejhouserequestComponent } from './getallaccrejhouserequest.component';

describe('GetallaccrejhouserequestComponent', () => {
  let component: GetallaccrejhouserequestComponent;
  let fixture: ComponentFixture<GetallaccrejhouserequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetallaccrejhouserequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetallaccrejhouserequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
