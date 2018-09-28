import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityloginComponent } from './authoritylogin.component';

describe('AuthorityloginComponent', () => {
  let component: AuthorityloginComponent;
  let fixture: ComponentFixture<AuthorityloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
