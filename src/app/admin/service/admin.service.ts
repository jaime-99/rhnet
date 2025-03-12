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
    let url = `https://itickets.cgpgroup.mx/apis/usuario/getUser.php`
    return this.http.get(url)
  }
  //obtener todos los departamentos
  getAllDepartments():Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/getDepartamentos.php`
    return this.http.get(url)
  }
  // son todos los puestos de acuerdo al departamento id 
  getAllPuestos(departamento_id:number):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/getPuestosForDepartamentoId.php?departamento_id=${departamento_id}`
    return this.http.get(url)
  }
  // Es para obtener todas las empresas 
  getAllEmpresas():Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/getEmpresas.php`
    return this.http.get(url)
  }
  // es para obtener las ciudades
  getAllCiudades():Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/getCiudades.php`
    return this.http.get(url)
  }

  // es para agregar un usuario completo (falta agregar permisos)
  addUsuarioCompleto(data:any):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/addUsuario.php`
    return this.http.post(url,data)
  }
  // es para obtener todos los datos del usuario ya correctamente 
  obtenerUsuariosCompleto(usuario_id:any):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/obtenerDatosDeUsuario.php?usuario_id=${usuario_id}`
    return this.http.get(url,usuario_id)
  }
}
