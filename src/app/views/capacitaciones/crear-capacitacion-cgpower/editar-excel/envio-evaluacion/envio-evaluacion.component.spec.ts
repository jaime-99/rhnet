import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioEvaluacionComponent } from './envio-evaluacion.component';

describe('EnvioEvaluacionComponent', () => {
  let component: EnvioEvaluacionComponent;
  let fixture: ComponentFixture<EnvioEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioEvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvioEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
