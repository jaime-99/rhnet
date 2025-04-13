import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formato-evaluacion',
  imports: [TableModule, CommonModule, ReactiveFormsModule],
  templateUrl: './formato-evaluacion.component.html',
  styleUrl: './formato-evaluacion.component.scss'
})


export class FormatoEvaluacionComponent implements OnInit{
  formFormato!:FormGroup;
  usuarios: any[] = [];
  datosUsuario: any = {};
  archivoSeleccionado!: File;
  formatoUsuario: any = {};

  constructor ( private adminService:AdminService, private fb:FormBuilder) { }
  ngOnInit(): void {

    this.formFormato = this.fb.group({
      usuario_id:['', Validators.required],
      nombre_archivo:['', Validators.required],
      url_archivo:['',]
    })


    this.ObtenerUsuarios();
  }

  ObtenerUsuarios(){
    this.adminService.getAllUsers().subscribe((res)=>{
      this.usuarios = res
    })
  }

  // obtiene la evaluacion por el ID del usuario
  ObtenerEvaluacionPorIdUsuario(id:any){
    this.adminService.obtenerDatosFormatoPorIdUsuario(id).subscribe((res)=>{
      this.formatoUsuario = res
      console.log('formato',res)
    })
  }

  obtenerUsuarioPorId(id:number){
    
    this.adminService.obtenerUsuariosCompleto(id).subscribe({
      next:(res)=>{
        this.ObtenerEvaluacionPorIdUsuario(id)
        console.log(res)
        this.datosUsuario = res.data
      }
    })
  }

onFileSelected(event: any) {
  this.archivoSeleccionado = event.target.files[0];
}

subirArchivoEvaluacion() {
  if (!this.archivoSeleccionado) {
    alert('Selecciona un archivo y un usuario.');
    return;
  }

  const formData = new FormData();
  let usuario_id = Number(this.datosUsuario.usuario_id)
  formData.append('usuario_id', this.datosUsuario.usuario_id);
  formData.append('formato_excel', this.archivoSeleccionado);

  this.adminService.subirFormato(formData).subscribe({
    next: (res: any) => {
      if (res.success) {
        alert(res.mensaje);
        this.formFormato.reset();
      } else {
        alert('Error: ' + res.mensaje);
      }
    },
    error: err => {
      console.error(err);
      alert('Ocurrió un error en el servidor');
    }
  });
}


}
