import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CapacitacionesService } from '../../../capacitaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
// clase para obtener los coemntarios de el usario quien fue evaluado
export class ComentariosComponent implements OnInit {

  @Input() evaluacion: any; // Recibe la evaluación seleccionada
  @Output() cerrarModal = new EventEmitter<void>();
  comentarios:any[] = [];
  comentarioSeleccionado: number | null = null;
  respuestaTexto: string = '';
  usuario: any;

  constructor (private capacitacionesService:CapacitacionesService) {}

  ngOnInit(): void {
      this.obtenerComentarios();
      const usuarioData:any = localStorage.getItem('usuario');
      this.usuario = JSON.parse(usuarioData)
  }

  
  obtenerComentarios(){
    if (!this.evaluacion || !this.evaluacion.id) {
      console.error('Error: No se ha recibido la evaluación correctamente');
      return;
    }
    this.capacitacionesService.verComentariosPorEvaluacionId(this.evaluacion.id).subscribe({
      next:(res)=>{
        this.comentarios = res.data
      }
    })

  }
  cerrar() {
    this.cerrarModal.emit();
  }

  toggleResponder(comentarioId: number) {
    this.comentarioSeleccionado = this.comentarioSeleccionado === comentarioId ? null : comentarioId;
  }

  responderComentario(comentarioId: number) {
    if (!this.respuestaTexto.trim()) {
      this.comentarioSeleccionado = null; // Cerrar el textarea si no se escribió nada
      return;
    }

    const nuevaRespuesta = {
      evaluacion_id: this.evaluacion.id,
      usuario_id: this.usuario.id, // Reemplaza con el usuario autenticado
      comentario: this.respuestaTexto,
      respondio_id : comentarioId || 1
    };
    this.capacitacionesService.agregarComentarioAEvaluacion(nuevaRespuesta).subscribe({
      next:(res)=>{
        console.log(res)
        location.reload();
      }
    })

    this.comentarios.push(nuevaRespuesta); // Simulación de respuesta en la lista
    this.respuestaTexto = '';
    this.comentarioSeleccionado = null;
  }
}
