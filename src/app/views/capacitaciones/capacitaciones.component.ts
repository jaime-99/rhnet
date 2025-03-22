

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-capacitaciones',
  imports: [CommonModule, FileUploadModule ],
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.scss'
})

// componente de capacitaciones 
export class CapacitacionesComponent implements OnInit {

  constructor (private router:Router) {}
  ngOnInit(): void {
    this.obtenerMes()
  }

  meses: string[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];



  irAEvaluar(mes?:string){
    //ir a pantalla de evaluar con el mes
    this.router.navigate(['evaluaciones/evaluar'], {queryParams:{mes:mes}})
  }

  // para ir a la evaluacion por el usuario_evaluador si es que tiene evaluaciones si no mostrar mensaje de que aun no tiene
  irEvaluacionForId(mes?:string){
    this.router.navigate(['evaluaciones/capacitacion-evaluador'], {queryParams:{mes:mes}})
  }

  //obtener mes actual
  obtenerMes(){
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = { month: 'long' }; // Usamos el tipo correcto
    const mes = fecha.toLocaleDateString('es-ES', opciones); // 'es-ES' para español
    return mes
  }
}
