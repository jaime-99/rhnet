import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEvaluacionesComponent } from './ver-evaluaciones.component';

describe('VerEvaluacionesComponent', () => {
  let component: VerEvaluacionesComponent;
  let fixture: ComponentFixture<VerEvaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEvaluacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
