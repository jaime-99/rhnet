import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionUsuarioEvaluadorComponent } from './capacitacion-usuario-evaluador.component';

describe('CapacitacionUsuarioEvaluadorComponent', () => {
  let component: CapacitacionUsuarioEvaluadorComponent;
  let fixture: ComponentFixture<CapacitacionUsuarioEvaluadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacitacionUsuarioEvaluadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitacionUsuarioEvaluadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
