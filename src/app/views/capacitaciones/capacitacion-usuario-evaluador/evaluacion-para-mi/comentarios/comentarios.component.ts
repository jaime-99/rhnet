import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CapacitacionesService } from '../../../capacitaciones.service';

@Component({
  selector: 'app-comentarios',
  imports: [],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
// clase para obtener los coemntarios de el usario quien fue evaluado
export class ComentariosComponent implements OnInit {

  @Input() evaluacion: any; // Recibe la evaluación seleccionada
  @Output() cerrarModal = new EventEmitter<void>();

  constructor (private capacitacionesService:CapacitacionesService) {}

  ngOnInit(): void {

  }

  
  obtenerComentarios(){

  }

  cerrar() {
    this.cerrarModal.emit();
  }

}
