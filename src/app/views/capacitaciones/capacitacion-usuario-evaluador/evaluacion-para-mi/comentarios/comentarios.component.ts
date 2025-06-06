import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CapacitacionesService } from '../../../capacitaciones.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { delay } from 'rxjs';
import { AdminService } from 'src/app/admin/service/admin.service';
@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ToastModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
// clase para obtener los coemntarios de el usario quien fue evaluado
export class ComentariosComponent implements OnInit {

  @Input() evaluacion: any; // Recibe la evaluación seleccionada
  @Output() cerrarModal = new EventEmitter<void>();
  comentarios:any[] = [];
  comentarioSeleccionado: number | null = null;
  respuestaTexto: any = '';
  usuario: any;
  loading: boolean = true;


  @Output() actualizarComentarios = new EventEmitter<void>();



  nuevoComentario = new FormControl('');
  datosUsuario:any =  {};

  constructor (private capacitacionesService:CapacitacionesService, private messageService:MessageService, private adminService:AdminService) {}

  ngOnInit(): void {
      this.obtenerComentarios();
      const usuarioData:any = localStorage.getItem('usuario');
      this.usuario = JSON.parse(usuarioData)
  }

  
  obtenerComentarios(){
    
    // this.actualizarComentarios.emit()
    if (!this.evaluacion || !this.evaluacion.id) {
      console.error('Error: No se ha recibido la evaluación correctamentes');
      return;
    }
    console.log('evaluacion', this.evaluacion);
    this.capacitacionesService.verComentariosPorEvaluacionId(this.evaluacion.id).pipe(
      delay(300)
    ).subscribe({
      next:(res)=>{
        this.comentarios = res.data
        this.loading = false;
        this.obtenerDatosUsuario()
        // console.log(this.usuario.id)
        // console.log('comentarios',this.comentarios)

        this.comentarios.forEach((comentario: any) => {
          if (comentario.respondio_id) {
            // Encuentra el comentario al que responde este comentario (el que tiene el `id` igual a `respondio_id`)
            const comentarioRespondido = this.comentarios.find((c) => c.id === comentario.respondio_id);
            if (comentarioRespondido) {
              // Asignamos al comentario original el texto "Respondido"
              comentarioRespondido.respondido = true;
              console.log(comentarioRespondido)

            }
          }else{
            console.log('nunca entra ya que el comentario.responido es null')
          }
        });
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

    console.log('datos del usuario,',this.datosUsuario)
    // return;

    const nuevaRespuesta = {
      evaluacion_id: this.evaluacion.id,
      usuario_id: this.usuario.id, // Reemplaza con el usuario autenticado
      comentario: this.respuestaTexto,
      respondio_id : comentarioId
    };
    // console.log(nuevaRespuesta);
    this.capacitacionesService.agregarComentarioAEvaluacion(nuevaRespuesta).pipe(
      delay(100)
    ).subscribe({
      next:(res)=>{
        //todo enviar correo si se contesto
        
        const data = {
          to: this.datosUsuario.data.usuario_correo,
          subject: `Nuevo comentario en evaluación por parte de ${this.datosUsuario.data.usuario_nombre}`,
          body: `Estimado(a),
        
        La persona ${this.datosUsuario.data.usuario_nombre} ha realizado un comentario sobre la evaluación con ID ${this.evaluacion.id}, correspondiente al mes de ${this.evaluacion.mes_evaluacion}.
        
        Por favor, accede a la plataforma para consultar el comentario: https://rhnet.cgpgroup.mx
        
        Atentamente,  
        Sistema de Evaluación - RHNet`,
        };
        

        this.capacitacionesService.enviarCorreoItickets(data).subscribe(()=>{

        })
        // console.log(res)
        // location.reload();
        this.obtenerComentarios();
      }
    })

    this.comentarios.push(nuevaRespuesta); // Simulación de respuesta en la lista
    this.respuestaTexto = '';
    this.comentarioSeleccionado = null;
  }


  // es para agregar el primer comentario si es que no hay comentarios 
  // agregarComentario(id?:number){

  //   if (!this.nuevoComentario.value?.trim()) {
  //     this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'El comentario no puede estar vacío.', life: 3000 });
  //     return;
  //   }

  //   const primerComentario = {
  //     evaluacion_id: this.evaluacion.id,
  //     usuario_id: this.usuario.id, // Reemplaza con el usuario autenticado
  //     comentario: this.nuevoComentario.value?.trim(),
  //     respondio_id : id
  //   };

  //   this.capacitacionesService.agregarComentarioAEvaluacion(primerComentario).subscribe({
  //     next:(res)=>{
  //       console.log(res)
  //       this.messageService.add({ severity: 'success', summary: 'COMPLETADO', detail: 'se agrego el comentario', life: 3000 });

  //       this.comentarios.push({
  //         id: res.data.id, // Asegúrate de que la API devuelva el ID del comentario recién creado
  //         evaluacion_id: this.evaluacion.id,
  //         usuario_id: this.usuario.id,
  //         comentario: this.nuevoComentario.value?.trim(),
  //         respondio_id: id,
  //         usuario: { nombre: this.usuario.nombre } // Muestra el nombre del usuario en el comentario
  //       });
  //       this.nuevoComentario.reset();
  //     },
  //     error: (err) => {
  //       console.error('Error al agregar comentario:', err);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el comentario', life: 3000 });
  //     }
  //   })

  // }
  agregarComentario(id?: number) {
    if (!this.nuevoComentario.value?.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'El comentario no puede estar vacío.', life: 3000 });
      return;
    }
  
    const primerComentario = {
      evaluacion_id: this.evaluacion.id,
      usuario_id: this.usuario.id,
      comentario: this.nuevoComentario.value.trim(),
      respondio_id: id
    };

    this.capacitacionesService.agregarComentarioAEvaluacion(primerComentario).subscribe({
      next: (res) => {
        // console.log(res);
        this.messageService.add({ severity: 'success', summary: 'COMPLETADO', detail: 'Comentario agregado', life: 3000 });
  
        // Si la API devuelve un ID, lo agregamos a la lista local para que se refleje en la vista
        const nuevoComentarioData = {
          id: res.data?.id || Math.random(), // Usa el ID devuelto o genera uno temporal
          evaluacion_id: this.evaluacion.id,
          usuario_id: this.usuario.id,
          usuario: this.usuario.nombre, // Muestra el nombre del usuario
          comentario: this.nuevoComentario.value?.trim(),
          fecha_creacion: new Date(), // Fecha actual para evitar que sea null
          respondio_id: id,
          respondido: false
        };
  
        // Agregar el nuevo comentario a la lista local
        this.comentarios.push(nuevoComentarioData);
        // Limpiar el input
        this.nuevoComentario.reset();
      },
      error: (err) => {
        console.error('Error al agregar comentario:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el comentario', life: 3000 });
      }
    });
  }


  // es para obtener los datos de un usuario
  obtenerDatosUsuario(){
    this.adminService.obtenerUsuariosCompleto(this.evaluacion.usuario_evaluador_id).subscribe((res)=>{
      this.datosUsuario = res
      console.log('datos usuario',res)
    })
  }
  
}
