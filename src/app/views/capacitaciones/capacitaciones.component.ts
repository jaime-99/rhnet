

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { CapacitacionesService } from './capacitaciones.service';
import { delay, map } from 'rxjs';

@Component({
  selector: 'app-capacitaciones',
  imports: [CommonModule, FileUploadModule ],
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.scss'
})
// componente de capacitaciones 
export class CapacitacionesComponent implements OnInit {
  usuario: any;
  capacitaciones: string[] = [];  // Inicializamos como un array vacío

  loading: boolean = false;

  constructor (private router:Router, private capacitacionesService:CapacitacionesService) {}
  ngOnInit(): void {

    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);
    this.obtenerMes()
    this.obtenerEvaluacionesPorUsuario();
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

  // para cambiar el color del mes que esta evaluado por al menos una persona
  obtenerEvaluacionesPorUsuario() {
    this.capacitacionesService.getEvaluacionForId(this.usuario.id).pipe(
      map((res: any) => res.map((item: any) => item.mes_evaluacion)), // Extraemos solo los meses evaluados
      delay(1000),
    ).subscribe({
      next: (capacitaciones) => {
        this.capacitaciones = capacitaciones; // Guardamos los meses evaluados
      },
      complete: () => {
        this.loading = true;
      }
    });
  }
  
  }

