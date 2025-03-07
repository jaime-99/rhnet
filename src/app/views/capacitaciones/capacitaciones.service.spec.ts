import { TestBed } from '@angular/core/testing';

import { CapacitacionesService } from './capacitaciones.service';

describe('CapacitacionesService', () => {
  let service: CapacitacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapacitacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
