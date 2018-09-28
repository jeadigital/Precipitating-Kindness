import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListallapprovedplansComponent } from './listallapprovedplans.component';

describe('ListallapprovedplansComponent', () => {
  let component: ListallapprovedplansComponent;
  let fixture: ComponentFixture<ListallapprovedplansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListallapprovedplansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListallapprovedplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
