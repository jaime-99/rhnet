import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {

  private datosPrivados: any;

  setDatosPrivados(datos: any) {
    this.datosPrivados = datos;
  }

  getDatosPrivados() {
    return this.datosPrivados;
  }

  constructor() { }
}
