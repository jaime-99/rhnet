import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-asignar-cursos',
  imports: [FormsModule,],
  templateUrl: './asignar-cursos.component.html',
  styleUrl: './asignar-cursos.component.scss'
})
export class AsignarCursosComponent implements OnInit {
  asignarCursoForm: FormGroup;

  constructor (private fb: FormBuilder) { 
    this.asignarCursoForm = this.fb.group({
      consultor: ['', Validators.required],
      curso: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horario: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    
  }

  onSubmit() {
    if (this.asignarCursoForm.valid) {
      console.log(this.asignarCursoForm.value);
      // Aquí enviarías los datos al backend o haces otra lógica
    } else {
      this.asignarCursoForm.markAllAsTouched();
    }
  }

}
