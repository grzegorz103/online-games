import { TestBed } from '@angular/core/testing';

import { PublicChatService } from './public-chat.service';

describe('PublicChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicChatService = TestBed.get(PublicChatService);
    expect(service).toBeTruthy();
  });
});
