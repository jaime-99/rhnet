import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarUsuarioMesComponent } from './agregar-usuario-mes.component';

describe('AgregarUsuarioMesComponent', () => {
  let component: AgregarUsuarioMesComponent;
  let fixture: ComponentFixture<AgregarUsuarioMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarUsuarioMesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarUsuarioMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
