import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Capacitaciones2Component } from './capacitaciones-2.component';

describe('Capacitaciones2Component', () => {
  let component: Capacitaciones2Component;
  let fixture: ComponentFixture<Capacitaciones2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capacitaciones2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Capacitaciones2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
