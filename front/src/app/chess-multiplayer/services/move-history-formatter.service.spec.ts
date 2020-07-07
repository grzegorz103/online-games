import { TestBed } from '@angular/core/testing';

import { MoveHistoryFormatterService } from './move-history-formatter.service';

describe('MoveHistoryFormatterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoveHistoryFormatterService = TestBed.get(MoveHistoryFormatterService);
    expect(service).toBeTruthy();
  });
});
