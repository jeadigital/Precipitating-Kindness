import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseownerhomeComponent } from './houseownerhome.component';

describe('HouseownerhomeComponent', () => {
  let component: HouseownerhomeComponent;
  let fixture: ComponentFixture<HouseownerhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseownerhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseownerhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
