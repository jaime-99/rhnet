import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table } from 'primeng/table';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-agregar-usuario-mes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TabsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule],
  templateUrl: './agregar-usuario-mes.component.html',
  styleUrl: './agregar-usuario-mes.component.scss'
})
export class AgregarUsuarioMesComponent implements OnInit {
  usuarios:any[] = [];
  periodos: any;

  usuarioSeleccionado: number | null = null;
  periodoSeleccionado: number | null = null;
  usuariosPeriodos: any[] = [];

  selectedMonth: number = 0; // Para llevar el control de la pestaña seleccionada
  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  nombreMesActual: string = this.meses[0]; // enero por default

  constructor (private adminService:AdminService) {}
  ngOnInit(): void {

    this.obtenerUsuarios();
    this.cargarPeriodos();
    this.obtenerUsuariosDePeriodos('enero')


  }


  obtenerUsuarios(){
    this.adminService.getAllUsers().subscribe({
      next:(res)=>{
        this.usuarios = res
        // console.log(res)
      }
    })
  }

  cargarPeriodos(){
    this.adminService.obtenerPeriodosEvaluacion().subscribe({
      next:(res)=>{
        this.periodos = res
        console.log('periodos',res)
      }
    })

  }


  onTabChange(value: string | number): void {
    const index = typeof value === 'number' ? value : this.meses.indexOf(value.toString());
    console.log(index)
    // console.log(this)
    this.selectedMonth = index;
    this.nombreMesActual = this.meses[index];
    this.filtrarPorMes(this.nombreMesActual);
  }
  

  asignarUsuario(){

  }

  obtenerUsuariosDePeriodos(mes: string){
    this.adminService.obtenerUsuariosPeriodos('enero').subscribe((res)=>{
      // this.usuariosPeriodos = res
      this.usuariosPeriodos = res.filter((usuario:any) => usuario.mes === mes);

      console.log('mes de ',mes,this.usuariosPeriodos)
    })
  }
   filtrarPorMes(mes: string): void {
    this.obtenerUsuariosDePeriodos(mes); // Filtra los usuarios por el mes seleccionado
  }

  cambiarEstado(periodo_id?:any, usuario_id?:any, periodo_activo?:any){

  }


  
  clear(table: Table) {
    table.clear();
}

}
