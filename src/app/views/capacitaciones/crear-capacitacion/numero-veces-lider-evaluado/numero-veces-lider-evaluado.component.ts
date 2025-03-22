import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../capacitaciones.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-numero-veces-lider-evaluado',
  imports: [CommonModule],
  templateUrl: './numero-veces-lider-evaluado.component.html',
  styleUrl: './numero-veces-lider-evaluado.component.scss'
})

// este simplemente sera un card para ver el numero de veces que tiene a un lider evaluado y si se evaluara de nuevo 

export class NumeroVecesLiderEvaluadoComponent implements OnInit {

  
  numEvaluaciones: any[] = []
  usuario: any;
  mesParametro: any;
  mensaje: string = '';
  evaluacionesDeEsteMes: any[] = [];
  mostrarAlert: boolean = false;
  
  constructor (private capacitacionesServce:CapacitacionesService,
    private route: ActivatedRoute  // Inyectar ActivatedRoute


  ) {
  }
  ngOnInit(): void {

    this.route.queryParams.subscribe(
      paramas => {
        this.mesParametro = paramas['mes'];
      }
    )
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);

    this.verEvaluacionesPorId()
  }



  verEvaluacionesPorId(){
   this.capacitacionesServce.getEvaluacionForId(this.usuario.id).subscribe({
    next:(res)=>{
      this.numEvaluaciones = res
      this.verificarEvaluacionLider();
    }
   }) 
  }


  verificarEvaluacionLider() {
    // Obtener el año actual

    // Filtrar las evaluaciones de tipo 'jefe' y verificar si ya se evaluó en el mes actual (mes recibido del fragmento)

    const evaluacionesJefe = this.numEvaluaciones.filter(
      (evaluacion) => evaluacion.tipo_evaluacion === 'jefe' &&
                     evaluacion.mes_evaluacion.toLowerCase() === this.mesParametro.toLowerCase()
    );

    this.evaluacionesDeEsteMes = evaluacionesJefe

    // Si ya existe una evaluación en el mes actual, mostrar un mensaje
    if (evaluacionesJefe.length > 0) {
      this.mensaje = `Ya has evaluado a tu jefe ${evaluacionesJefe.length} veces en el mes de  ${this.mesParametro} de este año. No puedes evaluarlo más de una vez.`;
      this.mostrarAlert = true;
    } else {
      this.mensaje = '';  // Si no hay evaluaciones, limpiar el mensaje
    }
  }

}
