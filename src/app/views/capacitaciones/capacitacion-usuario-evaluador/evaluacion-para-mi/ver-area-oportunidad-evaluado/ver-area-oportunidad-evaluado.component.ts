import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../../capacitaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-area-oportunidad-evaluado',
  imports: [FormsModule, Editor, CommonModule],
  templateUrl: './ver-area-oportunidad-evaluado.component.html',
  styleUrl: './ver-area-oportunidad-evaluado.component.scss'
})
export class VerAreaOportunidadEvaluadoComponent implements OnInit {
  id_evaluacion: any = '';
  notas: any = [];
  constructor(private capacitacionService:CapacitacionesService, private activatedRouter:ActivatedRoute){

  }
  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((res)=>{
      this.id_evaluacion = res['id_evaluacion']
    })

    this.verAreaDeOportunidad()
  }

  verAreaDeOportunidad(){
    this.capacitacionService.obtenerAreaDeOportunidad(this.id_evaluacion).subscribe({
      next:(res)=>{
        console.log(res)
        this.notas = res.nota['notas']
      }
    })
  }

  datosDeLaEvaluacion(){

  }

}
