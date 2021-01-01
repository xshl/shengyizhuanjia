import { TestBed } from '@angular/core/testing';

import { StorageLogService } from './storage-log.service';

describe('StorageLogService', () => {
  let service: StorageLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
