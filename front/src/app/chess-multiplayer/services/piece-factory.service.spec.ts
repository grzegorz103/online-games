import { TestBed } from '@angular/core/testing';

import { PieceFactoryService } from './piece-factory.service';

describe('PieceFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PieceFactoryService = TestBed.get(PieceFactoryService);
    expect(service).toBeTruthy();
  });
});
