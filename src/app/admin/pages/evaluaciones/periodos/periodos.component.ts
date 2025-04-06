import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-periodos',
  imports: [TableModule, CommonModule, ReactiveFormsModule, ToastModule, TagModule],
  templateUrl: './periodos.component.html',
  styleUrl: './periodos.component.scss'
})
export class PeriodosComponent implements OnInit {
  periodos: any;
  periodoSeleccionado:any = {};

  formPeriodos!:FormGroup
  constructor (private adminService:AdminService, private fb:FormBuilder, private messageService: MessageService){ }
  ngOnInit(): void {

    this.formPeriodos = this.fb.group({
      id:['', Validators.required],
      fecha_inicio:['', Validators.required],
      fecha_fin:['', Validators.required],
      activo:['', Validators.required]
    })

    this.obtenerPeriodosDeEvaluacion()


  }

  obtenerPeriodosDeEvaluacion(){
    this.adminService.obtenerPeriodosEvaluacion().subscribe((res)=>{
      this.periodos = res
      console.log(res)
    })
  }


  obtenerPeriodoPorId(id:number){

    console.log(id)



    this.adminService.obtenerPeriodoPorId(Number(id)).subscribe((res)=>{
      this.periodoSeleccionado = res

      this.formPeriodos.setValue({
        fecha_inicio: this.periodoSeleccionado.fecha_inicio,
        fecha_fin: this.periodoSeleccionado.fecha_fin,
        activo: this.periodoSeleccionado.activo,
        id:this.periodoSeleccionado.id
      });
    })



  }

  editarPeriodo(){

    if(this.formPeriodos.valid){
      this.adminService.editarPeriodoPorId(this.formPeriodos.value).subscribe({
        next:(res)=>{

          if(res.success){
            this.messageService.add({ severity: 'success', summary: 'Finalizado', detail: 'Se ha Actualizado con Exito', life: 3000 });
          }


          this.obtenerPeriodosDeEvaluacion();
        }
      })
    }

  }
}
