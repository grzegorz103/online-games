import { TestBed } from '@angular/core/testing';

import { MoveHistoryProviderService } from './move-history-provider.service';

describe('MoveHistoryProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoveHistoryProviderService = TestBed.get(MoveHistoryProviderService);
    expect(service).toBeTruthy();
  });
});
