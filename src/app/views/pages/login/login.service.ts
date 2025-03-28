import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }


  validacionIniciarSesion(usuario:string,contrasenia:string):Observable<any>{
    let url = `https://magna.cgpgroup.mx/rhnet/endpoints/endpoints/usuarios/iniciar_sesion.php?usuario=${usuario}&contrasenia=${contrasenia}`
    return this.http.get<any>(url);
  }
}
