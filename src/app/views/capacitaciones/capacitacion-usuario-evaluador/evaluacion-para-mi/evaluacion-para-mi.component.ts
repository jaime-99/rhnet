import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitacionesService } from '../../capacitaciones.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 

import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-evaluacion-para-mi',
  imports: [TableModule, CommonModule, ReactiveFormsModule],
  templateUrl: './evaluacion-para-mi.component.html',
  styleUrl: './evaluacion-para-mi.component.scss'
})
// componete para ver la evaluaciones que te hicieron a ti 
export class EvaluacionParaMiComponent implements OnInit {

  // @Input() Usuario:any
  mes: any;
  usuario: any;
  evaluaciones:any[] = []
  loading: boolean = false;
  evaluacionSeleccionada: any;
  comentario = new FormControl(''); // Inicializado con un valor vacío

  constructor (private activatedRouter:ActivatedRoute, private capacitacionesService:CapacitacionesService, private http:HttpClient) {}
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
    let datos = {
      evaluacion_id:  this.evaluacionSeleccionada?.id,
      usuario_id: this.usuario.id,
      comentario: this.comentario.value
    }

    this.capacitacionesService.agregarComentarioAEvaluacion(datos).subscribe({
      next:(res)=>{
        console.log(res)
      }
    })
  }
}
