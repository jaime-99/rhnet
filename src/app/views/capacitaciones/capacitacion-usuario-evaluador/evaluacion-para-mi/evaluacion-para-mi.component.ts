import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitacionesService } from '../../capacitaciones.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms'; 
import { ToastModule } from 'primeng/toast';
declare var bootstrap: any;
import { formatDate } from '@angular/common';

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
  mostrarMensajeNoHayEvaluaciones:boolean = false;
  comentario = new FormControl('', [
    Validators.required,      // El comentario es obligatorio
    Validators.pattern(/^(?!\s*$).+/)        // No permite solo espacios en blanco

  ]); // Inicializado con un valor vacío
  comentarios: any;
  mostrarMensaje: boolean = false;
  mostrarComentarios: boolean = true;

  constructor (private activatedRouter:ActivatedRoute, private capacitacionesService:CapacitacionesService, private http:HttpClient,
    private messageService: MessageService, private router:Router
  ) {}
  ngOnInit(): void {

    console.log(new Date())

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
    this.evaluacionSeleccionada = null;
    this.mostrarMensaje = false;
    this.evaluacionSeleccionada = evaluacion;

    // console.log(this.evaluacionSeleccionada)

    if(this.evaluacionSeleccionada.estatus === 'completada') {
      this.mostrarMensaje = true;
      this.obtenerComentarios(evaluacion) //checar 
    }
  }

  convertImageToBase64(logoUrl: string): Promise<string> {
    return fetch(logoUrl)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }
  
  // verEvaluacionPDF(){


  //   //colocar logo
  //   const logoUrl = '../../assets/Logo2.png';

  //   this.http.get(this.evaluacionSeleccionada?.archivo, { responseType: 'arraybuffer' }).subscribe(
  //         (data) => {
  //           const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
  //           const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //           const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
  //           // Convertir a PDF
  //           const doc = new jsPDF();
  //           autoTable(doc, {
  //             head: [jsonData[0] as any[]], // Forzar tipo de encabezado
  //             body: jsonData.slice(1) as any[][] // Forzar tipo del cuerpo
  //           });
      
  //           // Generar Blob del PDF
  //           const pdfBlob = doc.output('blob');
      
  //           // Crear una URL para el Blob y abrir en nueva pestaña
  //           const pdfUrl = URL.createObjectURL(pdfBlob);
  //           window.open(pdfUrl, '_blank');
  //         },
  //         (error) => {
  //           console.error('Error al descargar el archivo:', error);
  //         }
  //       );
  // }
  // para dar un update a la evaluacion de la tabla rh_evaluaciones en la columna estatus a completado

  // verEvaluacionPDF() {
  //   const logoUrl = '../../assets/Logo2.png';
  //   const nombreEvaluador = `${this.evaluacionSeleccionada.evaluador_nombre} ${this.evaluacionSeleccionada.evaluador_apellido_paterno}`;
  //   const fecha = this.evaluacionSeleccionada.fecha_creacion;
  //   const estatus = this.evaluacionSeleccionada.estatus;
  //   const mes = this.evaluacionSeleccionada.mes_evaluacion;
    
  //   this.convertImageToBase64(logoUrl).then((logoBase64) => {
  //     this.http.get(this.evaluacionSeleccionada?.archivo, { responseType: 'arraybuffer' }).subscribe(
  //       (data) => {
  //         const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
  //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  //         const doc = new jsPDF();
  
  //         // **Agregar el logo**
  //         doc.addImage(logoBase64, 'PNG', 10, 10, 40, 20); // X, Y, Width, Height
  
  //         // **Agregar los textos**
  //         doc.setFont('helvetica', 'bold');
  //         doc.setFontSize(12);
  //         doc.text('Evaluador:', 10, 35);
  //         doc.text('Fecha:', 10, 42);
  //         doc.text('Estatus:', 100, 35);
  //         doc.text('Mes:', 100, 42);
  
  //         // **Agregar los valores dinámicos**
  //         doc.setFont('helvetica', 'normal');
  //         doc.text(nombreEvaluador, 40, 35);
  //         doc.text(fecha, 40, 42);
  //         doc.text(estatus, 130, 35);
  //         doc.text(mes, 130, 42);
  
  //         // **Ajustar la tabla para que inicie después de los textos**
  //         autoTable(doc, {
  //           startY: 50, // 📌 Se ajusta la posición de la tabla después de los textos
  //           head: [jsonData[0] as any[]],
  //           body: jsonData.slice(1) as any[][]
  //         });
  
  //         // **Generar y abrir el PDF**
  //         const pdfBlob = doc.output('blob');
  //         const pdfUrl = URL.createObjectURL(pdfBlob);
  //         window.open(pdfUrl, '_blank');
  //       },
  //       (error) => {
  //         console.error('Error al descargar el archivo:', error);
  //       }
  //     );
  //   }).catch(error => console.error("Error cargando la imagen:", error));
  // }

  verEvaluacionPDF() {
      // if (!this.evaluacion || !this.evaluacion.archivo) {
      //   console.error('No hay URL de evaluación disponible');
      //   return;
      // }
    // console.log(this.evaluacionSeleccionada)
      // Datos adicionales
      const nombreEvaluador = this.evaluacionSeleccionada.evaluador_nombre;
      const fecha = this.evaluacionSeleccionada.fecha_creacion;
      // const evaluado = this.evaluacion.nombre_evaluado;
      const logoUrl = '../../assets/Logo2.png';
      const mes = this.evaluacionSeleccionada.mes_evaluacion;
    
      //  Precargar la imagen
        const logoImg = new Image();
        logoImg.src = logoUrl;
      
        //logo verde 
        const img = new Image();
        img.src = '../../assets/check-square-fill.png';
      
        const imagenRoja = new Image();
        imagenRoja.src = '../../assets/file-x-fill.png'
        img.onload = () => {
          this.http.get(this.evaluacionSeleccionada.archivo, { responseType: 'arraybuffer' }).subscribe(
            (data) => {
              const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
              const segundaEvaluacionIndex = jsonData.findIndex((row: any) => row[0] === 'Segunda Evaluación');
      
              const tableDataBefore = jsonData
                .slice(0, segundaEvaluacionIndex !== -1 ? segundaEvaluacionIndex : jsonData.length)
                .map((row: any) => [
                  row[0] || '',
                  row[1] || '',
                  (row[2] === 1 || row[2] === '1') ? '/' : (row[2] === 0 || row[2] === '0') ? 'x' : (row[2] ? row[2] : ''),
                  row[3] || ''
                ]);
      
              const tableDataAfter = segundaEvaluacionIndex !== -1
                ? jsonData.slice(segundaEvaluacionIndex).map((row: any) => [
                    row[0] || '',
                    row[1] || '',
                    row[2] === 1 ? '/' : row[2] === 0 ? 'x' : row[2] || '',
                    row[3] || ''
                  ])
                : [];
      
              const headersBefore = [['FACTOR 1', 'ÁREA DE DESEMPEÑO', 'EVALÚE A BASE DE', 'COMENTARIOS']];
              const headersAfter = [['ACTIVIDAD GENERAL', 'ACTIVIDADES ESPECÍFICAS', 'EVALÚE A BASE DE', 'COMENTARIOS']];
      
              const doc = new jsPDF();
              doc.setFont('Arial Unicode MS');
      
              // Agregar Logo principal
              doc.addImage(logoImg, 'PNG', 10, 10, 30, 30);
      
              // Títulos
              doc.setFontSize(12);
              doc.text('Evaluación de Desempeño', 80, 20);
              doc.setFontSize(10);
              doc.text(`Evaluador: ${nombreEvaluador}`, 10, 40);
              doc.text(`Fecha: ${fecha}`, 10, 45);
              // doc.text(`Evaluado: ${evaluado}`, 10, 50);
              doc.text(`Mes de Evaluación: ${mes}`, 10, 55);
      
              let finalY = 65;
      
              // Agregar la primera tabla
              autoTable(doc, {
                startY: finalY,
                head: headersBefore,
                body: tableDataBefore,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [0, 102, 204] },
                didDrawCell: (data) => {
                  const cellText = data.row.cells[2].text.join('');
      
                  // Si el contenido de la celda es '/' colocar la imagen
                  if (data.column.index === 2 && cellText === '/') {
                    doc.addImage(img, 'PNG', data.cell.x + 2, data.cell.y + 2, 5, 5);
                  }
                  if (data.column.index === 2 && cellText === 'x') {
                    doc.addImage(imagenRoja, 'PNG', data.cell.x + 2, data.cell.y + 2, 5, 5);
                  }
                }
              });
      
              // Segunda Evaluación
              if (segundaEvaluacionIndex !== -1 && tableDataAfter.length > 0) {
                doc.addPage();
                doc.setFontSize(12);
                doc.text('Segunda Evaluación', 80, 20);
      
                autoTable(doc, {
                  startY: 30,
                  head: headersAfter,
                  body: tableDataAfter,
                  theme: 'grid',
                  styles: { fontSize: 8 },
                  headStyles: { fillColor: [255, 69, 0] },
                  didDrawCell: (data) => {
                    const cellText = data.row.cells[2].text.join('');
      
                    if (data.column.index === 2 && cellText === '/') {
                      doc.addImage(img, 'PNG', data.cell.x + 2, data.cell.y + 2, 10, 10);
                    }
                  }
                });
              }
      
              // Generar y abrir PDF
              const pdfBlob = doc.output('blob');
              const pdfUrl = URL.createObjectURL(pdfBlob);
              window.open(pdfUrl, '_blank');
            },
            (error) => {
              console.error('Error al descargar el archivo:', error);
            }
          );
        };
    }
    
  
  
  marcarPorVistoEvaluacion(){
    if(this.comentario.valid){
      const fecha = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
      const fechaFormateada = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-MX');


      let datos = {
        evaluacion_id:  this.evaluacionSeleccionada?.id,
        usuario_id: this.usuario.id,
        comentario: this.comentario.value,
        respondio_id : null,
        fecha_creacion : fechaFormateada
      }
      // console.log(datos)
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
      this.mostrarMensaje = true;

    })
  }

  // es para abrir el modal de solo los comentarios
  // abrirModalComentarios() {
    
  //   const modalElement = document.getElementById('comentariosModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();
  //   }
  // }
  
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

  verAreaDeOportunidad(){
    console.log(this.evaluacionSeleccionada)
    let modal = document.getElementById('evaluacionModal');
    if (modal) {
        let modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    this.router.navigate(['/evaluaciones/ver-area-oportunidad-evaluado'], {queryParams:{id_evaluacion:this.evaluacionSeleccionada?.id}})
  }

// BORRA la evaluacion para que no se mande a los comentarios y asi cuando se abra el modal de nuevo agarre los datos de la evaluacion actual
abrirModalComentarios() {
  this.mostrarComentarios = false;
  setTimeout(() => {
    this.mostrarComentarios = true;
  }, 0);
}

}
