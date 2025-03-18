import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../capacitaciones.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-capacitacion-detalle',
  imports: [CommonModule, FormsModule],
  templateUrl: './capacitacion-detalle.component.html',
  styleUrl: './capacitacion-detalle.component.scss'
})
export class CapacitacionDetalleComponent implements OnInit {
  id: number = 0; 
  comentarios: any[] = [];
  comentarioSeleccionado: number | null = null;

  respuestaTexto: string = '';

  constructor(private capacitacionoService:CapacitacionesService,
    private activatedRouter:ActivatedRoute,
    private http: HttpClient

  ) {}
  usuario: any = '';
  public evaluacion:any

  ngOnInit(): void {
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData)
    this.activatedRouter.queryParams.subscribe(
      paramas => {
        this.id = paramas['id'];
      }
    )
    this.evaluacionForId()
  }


  evaluacionForId(){
    this.capacitacionoService.getEvaluacionForId1(Number(this.id)).subscribe({
      next:(res)=>{
        this.evaluacion = res
        // console.warn(res)
      }
    })
  }

  descargar() {
    if (!this.evaluacion || !this.evaluacion.archivo) {
      console.error('No hay URL de evaluación disponible');
      return;
    }
  
    // Descargar el archivo Excel desde la URL
    this.http.get(this.evaluacion.archivo, { responseType: 'arraybuffer' }).subscribe(
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
  

  verComentarios(){
    this.capacitacionoService.verComentariosPorEvaluacionId(Number(this.id)).subscribe((res)=>{
      this.comentarios = res.data
    })
  }
 
  toggleResponder(comentarioId: number) {
    this.comentarioSeleccionado = this.comentarioSeleccionado === comentarioId ? null : comentarioId;
  }

  responderComentario(comentarioId: number) {
    if (!this.respuestaTexto.trim()) {
      return;
    }

    const nuevaRespuesta = {
      idComentarioPadre: comentarioId,
      usuario: 'Usuario Actual', // Reemplaza con el usuario autenticado
      comentario: this.respuestaTexto,
      fecha: new Date().toISOString(),
    };

    this.comentarios.push(nuevaRespuesta); // Simulación de respuesta en la lista
    this.respuestaTexto = '';
    this.comentarioSeleccionado = null;
  }


  


}
