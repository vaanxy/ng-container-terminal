import { TestBed, inject } from '@angular/core/testing';

import { StorageAiDesignToolService } from './storage-ai-design-tool.service';

describe('StorageAiDesignToolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageAiDesignToolService]
    });
  });

  it('should ...', inject([StorageAiDesignToolService], (service: StorageAiDesignToolService) => {
    expect(service).toBeTruthy();
  }));
});
