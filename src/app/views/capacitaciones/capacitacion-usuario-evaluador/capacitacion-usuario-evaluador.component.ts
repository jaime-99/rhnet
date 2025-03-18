import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitacionesService } from '../capacitaciones.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';  // Importa RouterModule
import { delay, filter, map } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { EvaluacionParaMiComponent} from '../capacitacion-usuario-evaluador/evaluacion-para-mi/evaluacion-para-mi.component'
@Component({
  selector: 'app-capacitacion-usuario-evaluador',
  imports: [CommonModule, TableModule, RouterModule, ProgressSpinnerModule, TabsModule, EvaluacionParaMiComponent],
  templateUrl: './capacitacion-usuario-evaluador.component.html',
  styleUrl: './capacitacion-usuario-evaluador.component.scss'
})
//!es un componente donde podremos ver un listado de capacitaciones y ver los detalles
export class CapacitacionUsuarioEvaluadorComponent implements OnInit {
  mes: string = '';
  capacitaciones:string[] = [];
  usuario: any = '';
  loading: boolean = true;

  constructor (private activatedRouter:ActivatedRoute, private capacitacionService:CapacitacionesService,
    private router:Router
  ) { }
  ngOnInit(): void {
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);
    this.activatedRouter.queryParams.subscribe(
      paramas => {
        this.mes = paramas['mes'].toLowerCase();
      }
    )

    this.getCapacitacionForId()
  }

  getCapacitacionForId(){
    this.loading = true;
    this.capacitacionService.getEvaluacionForId(this.usuario.id).pipe(
      map((res:any) =>res.filter((item:any)=>item.mes_evaluacion === this.mes)),
      delay(1000),
    ).subscribe({
      next:(res)=>{
        // console.log(res)
          this.capacitaciones = res
        //  console.log(  'capacitaciones totall', this.capacitaciones)
      },
      complete:()=>{
        this.loading = false
      }
    })
  }

  // ir a detalles de capacitacion especifico
  irDetalles(id?:number){
    this.router.navigate(['/evaluaciones/detalles'],{queryParams:{id:id}}  )
  }


  // crear funcion para descargar o visualizar el pdf 
}
