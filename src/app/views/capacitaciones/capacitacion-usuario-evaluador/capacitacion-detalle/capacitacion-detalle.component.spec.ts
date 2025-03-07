import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionDetalleComponent } from './capacitacion-detalle.component';

describe('CapacitacionDetalleComponent', () => {
  let component: CapacitacionDetalleComponent;
  let fixture: ComponentFixture<CapacitacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacitacionDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
