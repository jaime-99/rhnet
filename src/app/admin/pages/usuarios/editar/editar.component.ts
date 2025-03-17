import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { delay } from 'rxjs';

@Component({
  selector: 'app-editar',
  imports: [ReactiveFormsModule, CommonModule, ToastModule ],
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
  usuarios: any;
  constructor (private adminService:AdminService, private fb:FormBuilder, private messageService: MessageService) {

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
          departamento: Number( this.datosUsuario?.departamento_id),
          puesto:Number( this.datosUsuario?.puesto_id),
          ciudad: Number(this.datosUsuario?.ciudad_id),
          empresa: Number(this.datosUsuario?.empresa_id),
          jefe: Number( this.datosUsuario?.jefe_id),
        });
        this.getDepartamentos();
        this.ObtenerUsuarios();

      }
    })
  }
  getDepartamentos(){
    this.adminService.getAllDepartments().subscribe((res)=>{
      this.departamentos = res
      this.getPuestos()
    })
  }
  getPuestos(departamento_id?:any){
    this.adminService.getAllPuestos(departamento_id || this.datosUsuario?.departamento_id).subscribe((res)=>{
      this.puestos = res
      this.getCiudades();

      const jefeActual = this.formUsuario.value.jefe; // Guarda el jefe actual
      this.formUsuario.patchValue({ jefe: jefeActual });

      
    })
  }
  getCiudades(){
    this.adminService.getAllCiudades().subscribe((res)=>{
      this.ciudades = res
      this.getEmpresas()
    })
  }
  getEmpresas(){
    this.adminService.getAllEmpresas().subscribe((res)=>{
      this.empresas = res
      // this.ObtenerUsuarios()

    })
  }
  // es para obtener Usuarios todos
  ObtenerUsuarios(){
    this.adminService.getAllUsers().pipe(
      delay(1500),
    ).subscribe((res)=>{
      this.usuarios = res

      this.formUsuario.patchValue({
        jefe: this.datosUsuario?.jefe_id || ''
      });
      this.loading = true
    })
  }
  ngSubmit(){
    const usuarioData = {
      id: this.datosUsuario.usuario_id,
      nombre: this.formUsuario.value.nombre,
      apellido_paterno: this.formUsuario.value.nombre_paterno,  // Corrección aquí
      apellido_materno: this.formUsuario.value.nombre_materno,  // Corrección aquí
      correo: this.formUsuario.value.correo,
      usuario: this.formUsuario.value.usuario,
      departamento_id: Number(this.formUsuario.value.departamento),
      puesto_id: Number(this.formUsuario.value.puesto),
      ciudad: Number(this.formUsuario.value.ciudad),  
      jefe_id: Number(this.formUsuario.value.jefe),
      empresa: Number(this.formUsuario.value.empresa)  
    };

    // console.log(usuarioData);
    
    this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Se actualizo el usuario correctamente', life: 3000 });
    this.adminService.editarUsuarioCompleto(usuarioData).subscribe((res)=>{
      // console.log(res)
      //mandar aviso de que se actualizo el usuario
      // location.reload()
      this.datosUsuario = { ...this.datosUsuario, ...usuarioData };
    })

}
onDepartamentoChange(event:any){
  // this.ObtenerUsuarios()
  const departamentoId = event.target.value;  // Obtenemos el id del departamento seleccionado
  this.formUsuario.patchValue({ puesto: '' }); // Reseteamos el campo puesto
  this.formUsuario.get('puesto')?.reset();
  this.formUsuario.get('puesto')?.markAsTouched();
  this.formUsuario.get('puesto')?.markAsDirty();



  // this.formUsuario.get('puesto')?.markAsUntouched();
  this.getPuestos(departamentoId)
}
}
