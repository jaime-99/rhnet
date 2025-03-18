import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionParaMiComponent } from './evaluacion-para-mi.component';

describe('EvaluacionParaMiComponent', () => {
  let component: EvaluacionParaMiComponent;
  let fixture: ComponentFixture<EvaluacionParaMiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionParaMiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionParaMiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
