import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgEasyMocksComponent } from './ng-easy-mocks.component';

describe('NgEasyMocksComponent', () => {
  let component: NgEasyMocksComponent;
  let fixture: ComponentFixture<NgEasyMocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgEasyMocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgEasyMocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
