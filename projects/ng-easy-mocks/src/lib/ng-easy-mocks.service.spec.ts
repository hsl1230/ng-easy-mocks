import { TestBed } from '@angular/core/testing';

import { NgEasyMocksService } from './ng-easy-mocks.service';

describe('NgEasyMocksService', () => {
  let service: NgEasyMocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgEasyMocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
