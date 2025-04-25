import { Component, ElementRef, OnInit, ViewChild, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { CapacitacionesService } from '../../capacitaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/admin/service/admin.service';
import { ToasterHostDirective } from '@coreui/angular';
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
  usuarioEvaluado: any = {};

  constructor(private capacitacionoService:CapacitacionesService,
    private activatedRouter:ActivatedRoute, private router:Router,
    private http: HttpClient, private adminService:AdminService

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
        console.warn('la evaluacion es ',res)
        this.obtenerDatosDeUsuarioEvaluado();
      }
    })
  }

  obtenerDatosDeUsuarioEvaluado(){
    this.adminService.obtenerUsuariosCompleto(this.evaluacion.usuario_evaluado_id).subscribe((res)=>{
      this.usuarioEvaluado = res
      console.log('usuario evaluado',this.usuarioEvaluado)
    })
  }


  
verPDF() {
  if (!this.evaluacion || !this.evaluacion.archivo) {
    console.error('No hay URL de evaluación disponible');
    return;
  }

  // Datos adicionales
  const nombreEvaluador = this.evaluacion.nombre_evaluador;
  const fecha = this.evaluacion.fecha_creacion;
  const evaluado = this.evaluacion.nombre_evaluado;
  const mes = this.evaluacion.mes_evaluacion;
  const logoUrl = '../../assets/Logo2.png';

  // Precargar la imagen
  const logoImg = new Image();
  logoImg.src = logoUrl;

  //logo verde 
  const img = new Image();
  img.src = '../../assets/check-square-fill.png';

  const imagenRoja = new Image();
  imagenRoja.src = '../../assets/file-x-fill.png'
  img.onload = () => {
    this.http.get(this.evaluacion.archivo, { responseType: 'arraybuffer' }).subscribe(
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
        doc.text(`Evaluado: ${evaluado}`, 10, 50);
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
      evaluacion_id: Number(this.evaluacion.id),
      usuario_id: this.usuario.id, // Reemplaza con el usuario autenticado
      comentario: this.respuestaTexto,
      respondio_id:comentarioId
    };

    this.capacitacionoService.agregarComentarioAEvaluacion(nuevaRespuesta).subscribe({
      next:(res)=>{
        this.verComentarios()

       // Mandar correo que respondio el comentario la que creo la evaluacion 
       const data = {
        to: this.usuarioEvaluado.data.usuario_correo,
        subject: `Nuevo comentario en tu evaluación por parte de ${this.evaluacion.nombre_evaluador}`,
        body: `Estimado(a),
      
      Se ha agregado un comentario a la evaluación con ID ${this.evaluacion.id}, enviada por ${this.evaluacion.nombre_evaluador}.
      
      Puedes acceder a la plataforma para consultar los detalles: https://rhnet.cgpgroup.mx
      
      Atentamente,  
      Sistema de Evaluación - CGP Group`,
      };
      
        this.capacitacionoService.enviarCorreoItickets(data).subscribe({
          next:(res)=>{
            console.log('se envia correo')
          }
        })
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
