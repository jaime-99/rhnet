import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }


  validacionIniciarSesion(usuario:string,contrasenia:string):Observable<any>{
    let url = `https://itickets.cgpgroup.mx/apis/usuario/getUserForUser.php?usuario=${usuario}&contrasenia=${contrasenia}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(url, {headers});
  }
}
