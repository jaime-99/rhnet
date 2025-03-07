import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCapacitacionCgpowerComponent } from './crear-capacitacion-cgpower.component';

describe('CrearCapacitacionCgpowerComponent', () => {
  let component: CrearCapacitacionCgpowerComponent;
  let fixture: ComponentFixture<CrearCapacitacionCgpowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCapacitacionCgpowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCapacitacionCgpowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
