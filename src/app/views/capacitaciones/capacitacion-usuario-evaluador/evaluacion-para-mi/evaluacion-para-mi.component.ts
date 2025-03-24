import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitacionesService } from '../../capacitaciones.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms'; 
import { ToastModule } from 'primeng/toast';
declare var bootstrap: any;

import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {ComentariosComponent} from '../evaluacion-para-mi/comentarios/comentarios.component'

@Component({
  selector: 'app-evaluacion-para-mi',
  imports: [TableModule, CommonModule, ReactiveFormsModule, ToastModule, ComentariosComponent],
  templateUrl: './evaluacion-para-mi.component.html',
  styleUrl: './evaluacion-para-mi.component.scss'
})
// componete para ver la evaluaciones que te hicieron a ti 
export class EvaluacionParaMiComponent implements OnInit {
  @ViewChild(ComentariosComponent) comentariosHijo!: ComentariosComponent;  // Referencia al componente hijo

  // @Input() Usuario:any
  mes: any;
  usuario: any;
  evaluaciones:any[] = []
  loading: boolean = false;
  evaluacionSeleccionada: any;
  comentario = new FormControl('', [
    Validators.required,      // El comentario es obligatorio
    Validators.pattern(/^(?!\s*$).+/)        // No permite solo espacios en blanco

  ]); // Inicializado con un valor vacío
  comentarios: any;
  mostrarMensaje: boolean = false;

  constructor (private activatedRouter:ActivatedRoute, private capacitacionesService:CapacitacionesService, private http:HttpClient,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {

    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);
    this.activatedRouter.queryParams.subscribe(
      paramas => {
        this.mes = paramas['mes'].toLowerCase();
      }
    )
    this.obtenerEvaluacion()
  }


  //obtener evaluacion por el usuario evaluado 
  obtenerEvaluacion(){
    //filtrar por el mes
    this.capacitacionesService.ObtenerEvluacionesPorElUsuario_evaluado_id(this.usuario.id).subscribe({

      next:(res)=>{
        this.evaluaciones = res.filter((e:any) => e.mes_evaluacion == this.mes)


        this.loading = true;
      }
    })
  }

  abrirModal(evaluacion:any){
    this.evaluacionSeleccionada = evaluacion;

    if(this.evaluacionSeleccionada.estatus === 'completada') {
      this.mostrarMensaje = true;
    }
    this.obtenerComentarios(evaluacion) //checar 
  }

  verEvaluacionPDF(){

    this.http.get(this.evaluacionSeleccionada?.archivo, { responseType: 'arraybuffer' }).subscribe(
          (data) => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
            // Convertir a PDF
            const doc = new jsPDF();
            autoTable(doc, {
              head: [jsonData[0] as any[]], // Forzar tipo de encabezado
              body: jsonData.slice(1) as any[][] // Forzar tipo del cuerpo
            });
      
            // Generar Blob del PDF
            const pdfBlob = doc.output('blob');
      
            // Crear una URL para el Blob y abrir en nueva pestaña
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          },
          (error) => {
            console.error('Error al descargar el archivo:', error);
          }
        );
  }
  // para dar un update a la evaluacion de la tabla rh_evaluaciones en la columna estatus a completado
  marcarPorVistoEvaluacion(){
    if(this.comentario.valid){

      let datos = {
        evaluacion_id:  this.evaluacionSeleccionada?.id,
        usuario_id: this.usuario.id,
        comentario: this.comentario.value,
        respondio_id : null
      }
      this.capacitacionesService.agregarComentarioAEvaluacion(datos).subscribe({
        next:(res)=>{
           // Agregar el nuevo comentario a la lista de comentarios local
        const nuevoComentario = {
          id: res.data?.id || Math.random(), // Si no devuelve ID, usa uno temporal
          evaluacion_id: this.evaluacionSeleccionada?.id,
          usuario_id: this.usuario.id,
          usuario: this.usuario.nombre, // Muestra el nombre del usuario
          comentario: this.comentario.value?.trim(),
          fecha_creacion: new Date(), // Fecha actual para mostrarlo de inmediato
          respondido: false
        };
        this.comentarios.push(nuevoComentario); // Agregarlo a la lista de comentarios
        this.comentario.reset(); // Limpiar el textarea
        this.mostrarMensaje = true; // Mostrar el mensaje de "Ya has marcado por visto"

        // obtiene los comentarios desde el hijo 
          this.comentariosHijo.obtenerComentarios();

        }
      })
    }
    //*marcar por visto la evaluacion
    this.capacitacionesService.cambiarEstatus(this.evaluacionSeleccionada?.id).subscribe((res)=>{
      this.messageService.add({ severity: 'success', summary: 'Enviado', detail: 'Se ha cambiado el estatus a COMPLETADA', life: 3000 });
      // console.log('update',res)
      this.evaluacionSeleccionada.estatus = 'completada'; // Actualizar localmente el estatus

    })
  }

  // es para abrir el modal de solo los comentarios
  abrirModalComentarios() {
    const modalElement = document.getElementById('comentariosModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  // para cerrar el modal de los comentarios 
  cerrarModal() {
    this.evaluacionSeleccionada = null;
  }

  obtenerComentarios(evaluacionSeleccionada:any){
    
    this.capacitacionesService.verComentariosPorEvaluacionId(evaluacionSeleccionada.id).subscribe({
      next:(res)=>{
        this.comentarios = res.data
        const ultimoComentario = [...this.comentarios].sort((a, b) => b.id - a.id)[0];

        // if(ultimoComentario.usuario_id == this.usuario.id){
        //   this.mostrarMensaje = true
        // }
      }
    })
  }
}
