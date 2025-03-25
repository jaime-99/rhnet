import { Component, OnInit } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { CapacitacionesService } from '../capacitaciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-area-de-oportunidad',
  imports: [EditorModule,FormsModule],
  templateUrl: './area-de-oportunidad.component.html',
  styleUrl: './area-de-oportunidad.component.scss'
})
export class AreaDeOportunidadComponent implements OnInit {
  evaluacion_id: any;
  evaluacion:any = [];
  usuario: any;

  constructor (private capacitacionService:CapacitacionesService, private activatedRouter:ActivatedRoute){

  }
  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((res)=>{
      this.evaluacion_id = res['id_evaluacion']
    })
    this.obtenerEvaluacionPorId()
    
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData)
    this.obtenerAreaDeOportunidad();
  }
  text: string | undefined;


  obtenerEvaluacionPorId(){
    this.capacitacionService.getEvaluacionForId1(this.evaluacion_id).subscribe({
      next:(res)=>{
        this.evaluacion = res
      }
    })
  }

  guardarAreaDeOportunidad() {
    if (!this.text?.trim()) {
      alert('El comentario no puede estar vacío.');
      return;
    }

    this.capacitacionService.guardarAreaOportunidad(Number(this.evaluacion_id), this.usuario.id, this.text)
      .subscribe(response => {
        alert('Comentario guardado correctamente');
        this.text = ''; // Limpiar el editor
      }, error => {
        alert('Error al guardar el comentario');
        console.error(error);
      });
  }

  obtenerAreaDeOportunidad(){

    this.capacitacionService.obtenerAreaDeOportunidad(Number(this.evaluacion_id)).subscribe({
      next:(res)=>{
        console.log(res)
        this.text = res.nota['notas']
        // console.log(this.text)

        return;
      }
    })

  }
}


