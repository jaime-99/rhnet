import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirEvidenciaComponent } from './subir-evidencia.component';

describe('SubirEvidenciaComponent', () => {
  let component: SubirEvidenciaComponent;
  let fixture: ComponentFixture<SubirEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirEvidenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
