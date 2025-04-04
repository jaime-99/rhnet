import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionesService {

  // public url = 'https://itickets.cgpgroup.mx/apis'
  constructor(private http:HttpClient) { }

  //obtener jefe directo de un usuario
  getJefeDirecto(id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getUsuarioYJefe.php?id=${id}`
    return this.http.get(url)
  }

  //subir archivo de capacitacion ya sea de jefe o de empleado 
  postSubirCapacitacion(file:any):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/subirArchivo.php`
    return this.http.post(url,file)
  }

  // subir la capacitacion a la tabla rh_capacitaciones
  postCapacitacion(data:any):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/postCapacitacion.php`
    return this.http.post(url,data)
  }

  //obtener jefes y empleados de la base de datos 
  getInfoForId(usuario_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getUsuarioInfo.php?usuario_id=${usuario_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  }

  // es para ver los empleados que tengo como jefe si es que soy jefe 
  getMisEmpleados(usuario_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/getSoyJefeDe.php?usuario_id=${usuario_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any[]>(url)
  }
  //todo cambiar a evaluacones porque es plural el resultao es
  // para ver las evaluaciones de una persona con el id del evaluador de la tabla rh_evaluaciones
  getEvaluacionForId(usuario_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/getEvaluacionForIdUsuario.php?usuario_id=${usuario_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any[]>(url)
  }
// es para obtener una solo evaluacion por el ID de la tabla rh_evaluaciones
  getEvaluacionForId1(id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/getEvaluacionForId.php?id=${id}`
    return this.http.get<any[]>(url)
  }
  // es para obtener el puesto y el departamento de un usuario
  getinfoPuestoYDepartamentoPorId(id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/usuarios/getInfoUsuarioComplete.php?id=${id}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  } 
  // es para ver las evaluaciones de los  empleados del usuario si es que tiene y su estatus
  getEvaluacionesMisEmpelados(usuario_id:number,mes:string):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/getEvaluacionesDeMisEmpleados.php?usuario_id=${usuario_id}&mes=${mes}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  }

  //obtener las evaluaciones de la tabla rh_evaluaciones por el usuario_evaluado_id
  ObtenerEvluacionesPorElUsuario_evaluado_id(evaluado_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/obtenerEvaluacionPorUsuarioEvaluado.php?usuario_id=${evaluado_id}&timestamp=${new Date().getTime()}`
    return this.http.get<any>(url)
  }

//obtener el excel de lider
  obtenerEvaluaciones() {
    return this.http.get('https://magna.cgpgroup.mx/rhnet/archivos/evaluaciones_descargar/Evaluacion_lider.xlsx', { responseType: 'arraybuffer' });
  }

  procesarExcel(data: ArrayBuffer): any[] {
    const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
    const sheetName = workbook.SheetNames[0]; 
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
  }

  // es para agregar comentario a una evaluacion
  agregarComentarioAEvaluacion(data:any):Observable<any>{
    let url = 'https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/agregarComentarioAEvaluacion.php'
    // let data = {}
    return this.http.post(url,data)
  }
  // es para ver todos los comentarios por el id de la evaluacion
  verComentariosPorEvaluacionId(evaluacion_id:any):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/verComentariosPorEvaluacionId.php?evaluacion_id=${evaluacion_id}}`
    return this.http.get(url)
  }

  // para actualizar el estatus de pendiente a completado en una evaluacion 
  cambiarEstatus(evaluacion_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/cambiarEstatusEvaluacion.php`
    return this.http.post(url, {evaluacion_id})
  }

  //cambiar area de oportunidad 

  guardarAreaOportunidad(evaluacion_id: number, usuario_id: number, notas: string): Observable<any> {
    let url = 'https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/guardar_AreaOportunidad.php'
    const body = { evaluacion_id, usuario_id, notas };
    return this.http.post<any>(url, body);
  }

  obtenerAreaDeOportunidad(evaluacion_id:number):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/obtenerAreaDeEvaluacion.php?evaluacion_id=${evaluacion_id}&timestamp=${new Date().getTime()}`;
    return this.http.get<any>(url)
  }

  obtenerPeriodosEvaluacion():Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones/obtenerPeriodosEvaluacion.php`
    return this.http.get<any>(url)
  }
}
