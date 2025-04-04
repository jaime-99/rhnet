import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements OnInit{

  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    this.getAllUsers()
  }

  

  //Obtener todos los usuarios totales
  getAllUsers():Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/obtenerTodosLosUsuarios.php`
    return this.http.get(url)
  }
  //obtener todos los departamentos
  getAllDepartments():Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getDepartamentos.php`
    return this.http.get(url)
  }
  // son todos los puestos de acuerdo al departamento id 
  getAllPuestos(departamento_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getPuestosForDepartamentoId.php?departamento_id=${departamento_id}`
    return this.http.get(url)
  }
  // Es para obtener todas las empresas 
  getAllEmpresas():Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getEmpresas.php`
    return this.http.get(url)
  }
  // es para obtener las ciudades
  getAllCiudades():Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getCiudades.php`
    return this.http.get(url)
  }

  // es para agregar un usuario completo (falta agregar permisos)
  addUsuarioCompleto(data:any):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/addUsuario.php`
    return this.http.post(url,data)
  }
  // es para obtener todos los datos del usuario ya correctamente 
  obtenerUsuariosCompleto(usuario_id: any): Observable<any> {
    const timestamp = new Date().getTime(); // Genera un parámetro único
    const url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/obtenerDatosDeUsuario.php?usuario_id=${usuario_id}`;
    return this.http.get(url);
  }
  // editar un usuario
  editarUsuarioCompleto(data:any):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/editarUsuario.php`
    return this.http.post(url,data)
  }

  //funcion para cambiar la contrasenia de un usuario
  cambiarContrasenia(usuario_id:number,password:string):Observable<any>{
    const url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/cambiarContrasenia.php`;
    const body = {usuario_id,password}
    return this.http.post(url,body)
  }

  //obtener periodos de los meses
  obtenerPeriodosEvaluacion():Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/obtenerTodosLosPeriodosDeEvaluacion.php`
    return this.http.get<any>(url)
  }
  //obtiene los usuarios que tienen periodos pasandole el parametro mes 
  obtenerUsuariosPeriodos(mes:string):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/obtener-usuarios-periodos.php?mes=${mes}`
    return this.http.get<any>(url)
  }
  

}
