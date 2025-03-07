import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCapacitacionComponent } from './crear-capacitacion.component';

describe('CrearCapacitacionComponent', () => {
  let component: CrearCapacitacionComponent;
  let fixture: ComponentFixture<CrearCapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCapacitacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
