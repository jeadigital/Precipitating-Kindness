import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedhouseComponent } from './completedhouse.component';

describe('CompletedhouseComponent', () => {
  let component: CompletedhouseComponent;
  let fixture: ComponentFixture<CompletedhouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedhouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedhouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
