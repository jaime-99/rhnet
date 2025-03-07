import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../capacitaciones.service';
import { ActivatedRoute } from '@angular/router';


import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-capacitacion-detalle',
  imports: [],
  templateUrl: './capacitacion-detalle.component.html',
  styleUrl: './capacitacion-detalle.component.scss'
})
export class CapacitacionDetalleComponent implements OnInit {
  id: number = 0; 

  constructor(private capacitacionoService:CapacitacionesService,
    private activatedRouter:ActivatedRoute,
    private http: HttpClient

  ) {}
  usuario: any = '';
  public evaluacion:any

  ngOnInit(): void {
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData)
    this.activatedRouter.queryParams.subscribe(
      paramas => {
        this.id = paramas['id'];
      }
    )
    this.evaluacionForId()
  }


  evaluacionForId(){
    this.capacitacionoService.getEvaluacionForId1(Number(this.id)).subscribe({
      next:(res)=>{
        console.log('capacitacion detalle:',res)
        this.evaluacion = res
      }
    })
  }


  descargar(){
    
  }



  


}
