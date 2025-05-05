import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class evidenciasCapacitaciones {
    constructor(private http:HttpClient) { }


    guardarAreaOportunidad(data:any): Observable<any> {
        let url = 'https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones-2/subirEvidencia.php'
        return this.http.post<any>(url, data);
      }

    obtenerEvidenciasPorUsuarioId(usuario_id:number): Observable<any> {
        let url = `https://magna.cgpgroup.mx/rhnet/endpoints/capacitaciones-2/obtenerEvidenciasPorUsuario_id.php?usuario_id=${usuario_id}`;
        return this.http.get<any>(url);
      }
    
}