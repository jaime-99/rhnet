import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDeOportunidadComponent } from './area-de-oportunidad.component';

describe('AreaDeOportunidadComponent', () => {
  let component: AreaDeOportunidadComponent;
  let fixture: ComponentFixture<AreaDeOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaDeOportunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaDeOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
