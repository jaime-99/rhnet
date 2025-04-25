import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-periodos',
  imports: [TableModule, CommonModule, ReactiveFormsModule, ToastModule, TagModule, MultiSelectModule, FormsModule],
  templateUrl: './periodos.component.html',
  styleUrl: './periodos.component.scss'
})
export class PeriodosComponent implements OnInit {
  periodos: any;
  periodoSeleccionado:any = {};

  formPeriodos!:FormGroup
  usuarios: any;

  usuariosSeleccionados!: any[];
  mostrarSelect: boolean = false;
  usuariosDeEvaluaciones: any;

  constructor (private adminService:AdminService, private fb:FormBuilder, private messageService: MessageService){ }
  ngOnInit(): void {

    this.formPeriodos = this.fb.group({
      id:['', Validators.required],
      fecha_inicio:['', Validators.required],
      fecha_fin:['', Validators.required],
      activo:['', Validators.required],
      es_general: [true], // nuevo campo
      usuarios_seleccionados: [[]] // importante: iniciar como array vacío
    })

    this.obtenerPeriodosDeEvaluacion()
    this.obtenerUsuarios()


  }
  

  obtenerPeriodosDeEvaluacion(){
    const ordenMeses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    this.adminService.obtenerPeriodosEvaluacion().subscribe((res: any[]) => {
      this.periodos = res
        .map(periodo => ({
          ...periodo,
          mes: periodo.mes.charAt(0).toUpperCase() + periodo.mes.slice(1).toLowerCase()
        }))
        .sort((a, b) => {
          return ordenMeses.indexOf(a.mes.toLowerCase()) - ordenMeses.indexOf(b.mes.toLowerCase());
        });
    });
      // console.log(res)
  }


  obtenerPeriodoPorId(id:number){

    // console.log(id)


    this.adminService.obtenerPeriodoPorId(Number(id)).subscribe((res)=>{
      this.periodoSeleccionado = res
      this.formPeriodos.setValue({
        fecha_inicio: this.periodoSeleccionado.fecha_inicio,
        fecha_fin: this.periodoSeleccionado.fecha_fin,
        activo: this.periodoSeleccionado.activo,
        id:this.periodoSeleccionado.id,
        es_general:this.periodoSeleccionado.es_general,
        usuarios_seleccionados:[]
      });

      
    this.adminService.obtenerUsuariosDeUnPeriodo(id).subscribe((res)=>{
      console.log(id)
      console.log('usuarios que ya estaban',res)
      
      this.usuariosDeEvaluaciones = res
      const idsComoString = res.map((u:any) => String(u.usuario_id));

      this.formPeriodos.patchValue({
        usuarios_seleccionados: idsComoString
        
      });
    })

    })



  }

  editarPeriodo(){

    // console.log(this.formPeriodos.value.usuarios_seleccionados)
    if(this.formPeriodos.get('es_general')?.value==false){

      this.adminService.agregarUsuarioAPeriodo(this.formPeriodos.value.usuarios_seleccionados,this.formPeriodos.get('id')?.value).subscribe((res)=>{
        
     })
    }


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


  obtenerUsuarios(){
    this.adminService.getAllUsers().subscribe((res)=>{
      this.usuarios = res 
      // console.log('usuarios',res)
    })
  }

  toggleSelect() {
    // console.log(this.formPeriodos.get('es_general')?.value)
    this.mostrarSelect = !this.mostrarSelect;
    // console.log(this.mostrarSelect)
  }
}
