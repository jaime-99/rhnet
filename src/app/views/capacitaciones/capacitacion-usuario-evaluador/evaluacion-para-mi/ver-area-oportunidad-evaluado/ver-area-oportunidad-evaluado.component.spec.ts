import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAreaOportunidadEvaluadoComponent } from './ver-area-oportunidad-evaluado.component';

describe('VerAreaOportunidadEvaluadoComponent', () => {
  let component: VerAreaOportunidadEvaluadoComponent;
  let fixture: ComponentFixture<VerAreaOportunidadEvaluadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAreaOportunidadEvaluadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAreaOportunidadEvaluadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
