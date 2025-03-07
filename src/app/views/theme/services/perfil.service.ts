import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService  {

  constructor(private http:HttpClient) { }

  private  url = ''


  getLogIn(usuario:string,contrasenia:string){
    let url = 'https://visualmanagment.com/AppCGP/apis/usuario/getUserForUser.php?usuario=jaime&contrasenia=jaime12345'
    this.http.get<any>(url)
  }
  
  putUsuario(data:any):Observable<any>{
    let url = 'https://visualmanagment.com/AppCGP/apis/usuario/putUser.php';
    return this.http.put<any>(url,data)
  }
}
