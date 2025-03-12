import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-editar',
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarComponent implements OnInit {
  @Input() usuario: any; // Recibir los datos del usuario
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  formUsuario:FormGroup
  datosUsuario: any = [];
  loading: boolean = false;
  departamentos: any[] = [];
  puestos: any = [];
  ciudades: any = [];
  empresas: any;
  constructor (private adminService:AdminService, private fb:FormBuilder) {

    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      nombre_paterno: ['', Validators.required],
      nombre_materno: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', Validators.required],
      // password: ['', Validators.required,Validators.minLength(6)],
      // password1: ['', Validators.required],
      departamento: ['', Validators.required],
      puesto: ['', Validators.required],
      ciudad: ['', Validators.required],
      empresa: ['', Validators.required],
      jefe: ['', Validators.required],
      
    },
  )
  this.formUsuario.addValidators(this.passwordsMatchValidator);
  }

  passwordsMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const password1 = form.get('password1')?.value;
    return password === password1 ? null : { passwordMismatch: true };
  };
  ngOnInit(): void {
    this.ObtenerDatos();
  }
  // es para obtener todos los datos del usuario ordenadamente
  ObtenerDatos(){

    this.adminService.obtenerUsuariosCompleto(this.usuario.id).subscribe({
      next:(res)=>{
        this.datosUsuario = res.data
        this.formUsuario.patchValue({
          nombre: this.datosUsuario?.usuario_nombre,
          nombre_paterno: this.datosUsuario?.usuario_apellido_paterno,
          nombre_materno: this.datosUsuario?.usuario_apellido_materno,
          usuario: this.datosUsuario?.usuario_usuario,
          correo: this.datosUsuario?.usuario_correo,
          departamento: this.datosUsuario?.departamento_id,
          puesto: this.datosUsuario?.puesto_id,
          ciudad: this.datosUsuario?.ciudad_id,
          jefe: this.datosUsuario?.jefe_nombre,
        });
        this.getDepartamentos();
      }
    })

  }
  getDepartamentos(){
    this.adminService.getAllDepartments().subscribe((res)=>{
      this.departamentos = res
      this.getPuestos()
    })
  }
  getPuestos(){
    this.adminService.getAllPuestos(this.datosUsuario?.departamento_id).subscribe((res)=>{
      this.puestos = res
      this.getCiudades();
    })
  }
  getCiudades(){
    this.adminService.getAllCiudades().subscribe((res)=>{
      this.ciudades = res
      this.loading = true
    })
  }
  getEmpresas(){
    this.adminService.getAllEmpresas().subscribe((res)=>{
      this.empresas = res
    })
  }
  ngSubmit(){

      const usuarioData = {
        id: this.datosUsuario.id,  // ID del usuario a actualizar
        nombre: this.formUsuario.value.nombre,
        apellido_paterno: this.formUsuario.value.nombre_paterno,
        apellido_materno: this.formUsuario.value.nombre_materno,
        correo: this.formUsuario.value.correo,
        usuario: this.formUsuario.value.usuario,
        password: this.formUsuario.value.password,  // Si es necesario, puedes enviar la contraseña nueva
        departamento_id: this.formUsuario.value.departamento,
        puesto_id: this.formUsuario.value.puesto,
        ciudad: this.formUsuario.value.ciudad,
        jefe_id: this.formUsuario.value.jefe,
        empresa: this.formUsuario.value.empresa  // Si también se desea actualizar la empresa
      };

      console.log(this.formUsuario.value)


  
  

}
}
