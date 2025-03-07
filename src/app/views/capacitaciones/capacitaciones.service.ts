import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionesService {

  public url = 'https://itickets.cgpgroup.mx/apis'
  constructor(private http:HttpClient) { }

  //obtener jefe directo de un usuario
  getJefeDirecto(id:number):Observable<any>{
    let url = `${this.url}/rhnet/getUsuarioYJefe.php?id=${id}`
    return this.http.get(url)
  }

  //subir archivo de capacitacion ya sea de jefe o de empleado 
  postSubirCapacitacion(file:any):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/capacitaciones/subirArchivo.php`
    return this.http.post(url,file)
  }

  // subir la capacitacion a la tabla rh_capacitaciones
  postCapacitacion(data:any):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/capacitaciones/postCapacitacion.php`
    return this.http.post(url,data)
  }

  //obtener jefes y empleados de la base de datos 
  getInfoForId(usuario_id:number):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/getUsuarioInfo.php?usuario_id=${usuario_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  }

  // es para ver los empleados que tengo como jefe si es que soy jefe 
  getMisEmpleados(usuario_id:number):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/capacitaciones/getSoyJefeDe.php?usuario_id=${usuario_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any[]>(url)
  }
  //todo cambiar a evaluacones porque es plural el resultao es
  // para ver las evaluaciones de una persona con el id del evaluador de la tabla rh_evaluaciones
  getEvaluacionForId(usuario_id:number):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/capacitaciones/getEvaluacionForIdUsuario.php?usuario_id=${usuario_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any[]>(url)
  }
// es para obtener una solo evaluacion por el ID de la tabla rh_evaluaciones
  getEvaluacionForId1(id:number):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/capacitaciones/getEvaluacionForId.php?id=${id}`
    return this.http.get<any[]>(url)
  }

  // es para obtener el puesto y el departamento de un usuario
  getinfoPuestoYDepartamentoPorId(id:number):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/usuarios/getInfoUsuarioComplete.php?id=${id}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  } 

  // es para ver las evaluaciones de los  empleados del usuario si es que tiene y su estatus
  getEvaluacionesMisEmpelados(usuario_id:number,mes:string):Observable<any>{
    let url = `https://rhnet.cgpgroup.mx/endpoints/capacitaciones/getEvaluacionesDeMisEmpleados.php?usuario_id=${usuario_id}&mes=${mes}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  }
}
