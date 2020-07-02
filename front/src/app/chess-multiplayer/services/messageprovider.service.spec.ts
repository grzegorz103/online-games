import { TestBed } from '@angular/core/testing';

import { MessageproviderService } from './messageprovider.service';

describe('MessageproviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageproviderService = TestBed.get(MessageproviderService);
    expect(service).toBeTruthy();
  });
});
