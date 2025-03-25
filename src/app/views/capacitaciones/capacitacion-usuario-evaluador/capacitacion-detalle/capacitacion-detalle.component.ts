import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CapacitacionesService } from '../../capacitaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const doc = new jsPDF() as any; // Evita error de TypeScript


@Component({
  selector: 'app-capacitacion-detalle',
  imports: [CommonModule, FormsModule],
  templateUrl: './capacitacion-detalle.component.html',
  styleUrl: './capacitacion-detalle.component.scss'
})
export class CapacitacionDetalleComponent implements OnInit {
  @ViewChild('exampleModal') modalRef!: ElementRef;

  id: number = 0; 
  comentarios: any[] = [];
  comentarioSeleccionado: number | null = null;

  respuestaTexto: string = '';

  constructor(private capacitacionoService:CapacitacionesService,
    private activatedRouter:ActivatedRoute, private router:Router,
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
        console.warn(res)
      }
    })
  }

  // verPDF() {
  //   if (!this.evaluacion || !this.evaluacion.archivo) {
  //     console.error('No hay URL de evaluación disponible');
  //     return;
  //   }
  
  //   // Descargar el archivo Excel desde la URL
  //   this.http.get(this.evaluacion.archivo, { responseType: 'arraybuffer' }).subscribe(
  //     (data) => {
  //       const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
  //       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  //       // Convertir a PDF
  //       const doc = new jsPDF();
  //       autoTable(doc, {
  //         head: [jsonData[0] as any[]], // Forzar tipo de encabezado
  //         body: jsonData.slice(1) as any[][] // Forzar tipo del cuerpo
  //       });
  //       // Generar Blob del PDF
  //       const pdfBlob = doc.output('blob');
  //       // Crear una URL para el Blob y abrir en nueva pestaña
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       window.open(pdfUrl, '_blank');
  //     },
  //     (error) => {
  //       console.error('Error al descargar el archivo:', error);
  //     }
  //   );
  // }
  
  verPDF() {
    if (!this.evaluacion || !this.evaluacion.archivo) {
      console.error('No hay URL de evaluación disponible');
      return;
    }
  
    // Datos adicionales
    const nombreEvaluador = this.evaluacion.nombre_evaluador;
    const fecha = this.evaluacion.fecha_creacion;
    const evaluado = this.evaluacion.nombre_evaluado;
    const logoUrl = '../../assets/Logo2.png';
    const mes = this.evaluacion.mes_evaluacion;
  
    this.http.get(this.evaluacion.archivo, { responseType: 'arraybuffer' }).subscribe(
      (data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        // Buscar el índice donde aparece "Segunda Evaluación"
        const segundaEvaluacionIndex = jsonData.findIndex((row: any) => row[0] === 'Segunda Evaluación');
  
        // Datos antes de "Segunda Evaluacion"
        const tableDataBefore = jsonData
          .slice(0, segundaEvaluacionIndex !== -1 ? segundaEvaluacionIndex : jsonData.length)
          .map((row: any) => [
            row[0] || '', // Primera columna
            row[1] || '', // Segunda columna
            row[2] || '', // Tercera columna
            row[3] || ''  // Cuarta columna
          ]);
  
        // Datos después de "Segunda Evaluacion"
        const tableDataAfter = segundaEvaluacionIndex !== -1
          ? jsonData.slice(segundaEvaluacionIndex).map((row: any) => [  // ⚠️ Ahora incluye "Segunda Evaluación"
              row[0] || '', 
              row[1] || '', 
              row[2] || '', 
              row[3] || ''
            ])
          : [];
  
        // Encabezados
        const headersBefore = [['FACTOR 1', 'ÁREA DE DESEMPEÑO', 'EVALÚE A BASE DE %', 'COMENTARIOS']];
        const headersAfter = [['ACTIVIDAD GENERAL', 'ACTIVIDADES ESPECÍFICAS', 'EVALÚE A BASE DE %', 'COMENTARIOS']];
  
        const doc = new jsPDF();
            
        // Agregar Logo
        const img = new Image();
        img.src = logoUrl;
        img.onload = () => {
          doc.addImage(img, 'PNG', 10, 10, 30, 30);
  
          // Títulos
          doc.setFontSize(12);
          doc.text('Evaluación de Desempeño', 80, 20);
          doc.setFontSize(10);
          doc.text(`Evaluador: ${nombreEvaluador}`, 10, 40);
          doc.text(`Fecha: ${fecha}`, 10, 45);
          doc.text(`Evaluado: ${evaluado}`, 10, 50);
          doc.text(`Mes de Evaluación: ${mes}`, 10, 55);
  
          // Agregar la primera tabla (antes de "Segunda Evaluación")
          let finalY = 65; // Posición inicial de la tabla
          autoTable(doc, {
            startY: finalY,
            head: headersBefore,
            body: tableDataBefore,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 102, 204] } // Azul
          });
  
          // Verificar si hay "Segunda Evaluación"
          if (segundaEvaluacionIndex !== -1 && tableDataAfter.length > 0) {
            // Agregar una nueva página antes de la segunda tabla
            doc.addPage();
  
            // Título para la segunda tabla
            doc.setFontSize(12);
            doc.text('Segunda Evaluación', 80, 20);
  
            // Agregar la segunda tabla en la nueva página
            autoTable(doc, {
              startY: 30, // Reiniciar la posición en la nueva hoja
              head: headersAfter,
              body: tableDataAfter,
              theme: 'grid',
              styles: { fontSize: 8 },
              headStyles: { fillColor: [255, 69, 0] } // Naranja
            });
          }
  
          // Generar y abrir PDF
          const pdfBlob = doc.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
        };
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }
  
  

  verComentarios(){
    this.capacitacionoService.verComentariosPorEvaluacionId(Number(this.id)).pipe(
      
    ).subscribe((res)=>{
      this.comentarios = res.data
      // console.log('comentarios',this.comentarios)
      const ultimoComentario = [...this.comentarios].sort((a, b) => b.id - a.id)[0];
      // console.log('ultimo comentario',ultimoComentario.usuario_id)
        
        
      // if(
        
      // )
      this.comentarios.forEach((comentario: any) => {
        if (comentario.respondio_id) {
          // Encuentra el comentario al que responde este comentario (el que tiene el `id` igual a `respondio_id`)
          const comentarioRespondido = this.comentarios.find((c) => c.id === comentario.respondio_id);
          if (comentarioRespondido) {
            // Asignamos al comentario original el texto "Respondido"
            comentarioRespondido.respondido = true;
          }
        }
      });
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
      evaluacion_id: this.evaluacion.id,
      usuario_id: this.usuario.id, // Reemplaza con el usuario autenticado
      comentario: this.respuestaTexto,
      respondio_id:comentarioId
    };

    this.capacitacionoService.agregarComentarioAEvaluacion(nuevaRespuesta).subscribe({
      next:(res)=>{

      }
    })
    this.comentarios.push(nuevaRespuesta); // Simulación de respuesta en la lista
    this.respuestaTexto = '';
    this.comentarioSeleccionado = null;
  }


  // es para ir al template de crear el area de oportunidad 

  crearArea(id?:any){
    this.router.navigate(['evaluaciones/area-oportunidad'], {queryParams:{id_evaluacion:id}})
  }
  


}
