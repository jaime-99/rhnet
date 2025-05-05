import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {evidenciasCapacitaciones} from '../../../../../src/app/views/capacitaciones-2/evidencias-capacitaciones.service'
declare var bootstrap: any; // si no usas Bootstrap vía módulo Angular

@Component({
  selector: 'app-capacitaciones',
  imports: [FormsModule, CommonModule],
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.scss'
})
export class CapacitacionesComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  departamentos: any[] = [];
  departamentoSeleccionado: number | null = null;
  usuarioSeleccionado: any;
  constructor (private adminService:AdminService, private evidenciasCapacitaciones:evidenciasCapacitaciones) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerDepartamentos();
  }


  obtenerUsuarios(){
    this.adminService.getAllUsers().subscribe((res)=>{
      console.log(res)
      this.usuarios = res 
    })
  }
  obtenerDepartamentos(){
    this.adminService.getAllDepartments().subscribe((res)=>{
      this.departamentos = res
      console.log(res)
    })
  }

  filtrarUsuarios() {
    console.log(this.departamentoSeleccionado)
    if (this.departamentoSeleccionado != null) {
      this.usuariosFiltrados = this.usuarios.filter(
        u => u.departamento_id === String(this.departamentoSeleccionado)
      );
    } else { 
      this.usuariosFiltrados = [];
    }
  }

  abrirModal(usuario: any) {
    this.usuarioSeleccionado = usuario;
    const modal = new bootstrap.Modal(document.getElementById('opcionesModal'));
    modal.show();
    this.obtenerCapacitacionesPorId(this.usuarioSeleccionado)
  }

  //Obtiene las evidencias de la tabla rh_evidencias por ID 
  obtenerCapacitacionesPorId(usuario:any){
    console.log();
    this.evidenciasCapacitaciones.obtenerEvidenciasPorUsuarioId(usuario.usuario_id).subscribe({
      next:(res)=>{
        // console.log(res)
      }
    })

  }
}
