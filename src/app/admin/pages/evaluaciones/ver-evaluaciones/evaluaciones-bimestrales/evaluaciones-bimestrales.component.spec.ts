import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesBimestralesComponent } from './evaluaciones-bimestrales.component';

describe('EvaluacionesBimestralesComponent', () => {
  let component: EvaluacionesBimestralesComponent;
  let fixture: ComponentFixture<EvaluacionesBimestralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionesBimestralesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionesBimestralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
