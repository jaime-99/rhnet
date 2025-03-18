import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCapacitacionLiderComponent } from './crear-capacitacion-lider.component';

describe('CrearCapacitacionLiderComponent', () => {
  let component: CrearCapacitacionLiderComponent;
  let fixture: ComponentFixture<CrearCapacitacionLiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCapacitacionLiderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCapacitacionLiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
