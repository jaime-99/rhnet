import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroVecesLiderEvaluadoComponent } from './numero-veces-lider-evaluado.component';

describe('NumeroVecesLiderEvaluadoComponent', () => {
  let component: NumeroVecesLiderEvaluadoComponent;
  let fixture: ComponentFixture<NumeroVecesLiderEvaluadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumeroVecesLiderEvaluadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumeroVecesLiderEvaluadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
