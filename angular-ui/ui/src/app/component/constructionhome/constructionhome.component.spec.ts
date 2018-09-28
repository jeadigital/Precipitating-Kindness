import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionhomeComponent } from './constructionhome.component';

describe('ConstructionhomeComponent', () => {
  let component: ConstructionhomeComponent;
  let fixture: ComponentFixture<ConstructionhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
