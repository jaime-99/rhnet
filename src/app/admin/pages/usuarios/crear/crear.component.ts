import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  // Importar ReactiveFormsModule
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-crear',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})
export class CrearComponent implements OnInit {

  createUserForm: FormGroup;  // FormGroup para el formulario
  departamentos: any;
  puestos: any = [];
  empresas: any = [];
  ciudades: any = [];
  usuarios: any = [];

  constructor (private fb:FormBuilder, private adminService:AdminService,) {
    this.createUserForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido_paterno: ['', [Validators.required]],
      apellido_materno: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      usuario: ['', [Validators.required,]],
      password: ['', [Validators.required]],
      departamento_id: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      puesto_id: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      jefe_id: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {

    this.getAllDepartamentos();
    this.getEmpresas()
    this.getCiudades()
    this.getUsuarios()
  }
  //obtener todos los departamentos
  getAllDepartamentos(){
    this.adminService.getAllDepartments().subscribe((res)=>{
      this.departamentos = res
    })
  }
  // Llamar a la API para obtener los puestos de un departamento específico
  onDepartamentoChange(event: any) {
    const departamentoId = event.target.value;  // Obtenemos el id del departamento seleccionado
    this.getPuestoForId(departamentoId);
  }
  //obtener el puesto por el departamento id
  getPuestoForId(departamentoId:number){
    this.adminService.getAllPuestos(departamentoId).subscribe({
      next:(res)=>{
        this.puestos = res;  // Si es un array, lo asignamos a la variable puestos
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }
  getEmpresas(){
    this.adminService.getAllEmpresas().subscribe(res=>{
      this.empresas = res
    })
  }
  getCiudades(){
    this.adminService.getAllCiudades().subscribe(res=>{
      this.ciudades = res
    })
  }
  getUsuarios(){
    this.adminService.getAllUsers().subscribe((res)=>{
      this.usuarios = res 
    })
  }

  onSubmit(){
//todo pendiente casi terminado
    const data = {
      nombre: this.createUserForm.get('nombre')?.value,
      apellido_paterno: this.createUserForm.get('apellido_paterno')?.value,
      apellido_materno: this.createUserForm.get('apellido_materno')?.value,
      correo: this.createUserForm.get('correo')?.value,
      usuario: this.createUserForm.get('usuario')?.value,
      password: this.createUserForm.get('password')?.value,
      departamento_id: parseInt( this.createUserForm.get('departamento_id')?.value,10),
      ciudad: parseInt( this.createUserForm.get('ciudad')?.value, 10),
      puesto_id: parseInt( this.createUserForm.get('puesto_id')?.value, 10) || null,
      empresa: parseInt( this.createUserForm.get('empresa')?.value, 10 ),
      jefe_id: parseInt(this.createUserForm.get('jefe_id')?.value, 10) || null

    }

    console.log(data)
    this.adminService.addUsuarioCompleto(data).subscribe({
      next:(res)=>{
        console.log(res)
      }
    })
  }
}
