import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarExcelComponent } from './editar-excel.component';

describe('EditarExcelComponent', () => {
  let component: EditarExcelComponent;
  let fixture: ComponentFixture<EditarExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
