import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vacaciones2Component } from './vacaciones2.component';

describe('Vacaciones2Component', () => {
  let component: Vacaciones2Component;
  let fixture: ComponentFixture<Vacaciones2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacaciones2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vacaciones2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
