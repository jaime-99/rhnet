import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { AdminService } from '../../../../service/admin.service';
import { CapacitacionesService } from '../../../../../views/capacitaciones/capacitaciones.service';
import { TableModule,Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect'
import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-evaluaciones-bimestrales',
  imports: [TabsModule, CommonModule, TableModule, MultiSelectModule, InputTextModule, ToastModule],
  templateUrl: './evaluaciones-bimestrales.component.html',
  styleUrl: './evaluaciones-bimestrales.component.scss'
})
export class EvaluacionesBimestralesComponent  implements OnInit {
  evaluaciones: any;
  searchValue: string = '';
  mesSeleccionado: string = '';
  ciudadSeleccionada: string = '';
  usuarios: any;
  // son las evaluaciones que me han realizado a mi 
  evaluacionesPorId: any;

  constructor (private adminService:AdminService, private capacitacionesService:CapacitacionesService, 
    private messageService:MessageService,
    private http: HttpClient
    
  ) {}

  ngOnInit(): void {
    this.obtenerEvaluaciones();
    this.ObtenerUsuarios();
  }


  //obtener evaluaciones
  obtenerEvaluaciones(){
    this.capacitacionesService.obtenerTodasLasEvaluaciones().subscribe({
      next:(res)=>{
        this.evaluaciones = res
      }
    })
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

   clear(table: Table) {
      table.clear();
      this.searchValue = ''
      this.mesSeleccionado = '';
      this.ciudadSeleccionada = '';
  }

  // filtro para que solo sea de mi jefe directo las evaluaciones
  obtenerEvaluacionesPorIdUsuario(usuario:any){
    this.capacitacionesService.ObtenerEvluacionesPorElUsuario_evaluado_id(usuario.usuario_id).subscribe({
      next:(res)=>{
        console.log(res)
        //filtra para obtener solo las evaluaciones que le hizo el jefe directo
        this.evaluacionesPorId = res.filter((evaluacion: any) => evaluacion.usuario_evaluador_id == usuario.jefe_id);
        console.log(this.evaluacionesPorId);
      }
    })
  }

  ObtenerUsuarios(){
    this.adminService.getAllUsers().subscribe((res)=>{
      this.usuarios = res
      console.log(res)
    })
  }
  verPDF(usuario:any){
    this.obtenerEvaluacionesPorIdUsuario(usuario)
  }

  verPDFDoble(mes?: string) {
    console.log('desde verPdfDoble',this.evaluacionesPorId)
    console.log(this.evaluacionesPorId[0])
    console.log(this.evaluacionesPorId[1])
    // return;
    // Filtra las evaluaciones del mes seleccionado
    this.generarPDFDoble(this.evaluacionesPorId[0], this.evaluacionesPorId[1]);
    // const evaluacionesDelMes = this.evaluacionesPorId.filter(e => e.mes_evaluacion === mes);
  
    // if (evaluacionesDelMes.length === 2) {
    //   // Usar las dos evaluaciones para generar el PDF
    // } else {
    //   // this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'No se encontraron dos evaluaciones para ese mes.' });
    // }
  }
  

  generarPDFDoble(evaluacion1: any, evaluacion2: any) {
    console.log(evaluacion1)
    console.log(evaluacion2)

    if(evaluacion1 && evaluacion2){

      const logoUrl = '../../assets/Logo2.png';
      const logoImg = new Image();
      logoImg.src = logoUrl;
    
      const checkImg = new Image();
      checkImg.src = '../../assets/check-square-fill.png';
    
      const crossImg = new Image();
      crossImg.src = '../../assets/file-x-fill.png';
    
      logoImg.onload = () => {
        forkJoin([
          this.http.get(evaluacion1.archivo, { responseType: 'arraybuffer' }),
          this.http.get(evaluacion2.archivo, { responseType: 'arraybuffer' })
        ]).subscribe({
          next: ([data1, data2]) => {
            const workbook1 = XLSX.read(new Uint8Array(data1), { type: 'array' });
            const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
            const json1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
    
            const workbook2 = XLSX.read(new Uint8Array(data2), { type: 'array' });
            const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
            const json2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
    
            const doc = new jsPDF();
            doc.setFont('Arial Unicode MS');
    
            const procesarEvaluacion = (doc: any, jsonData: any, evaluacion: any, titulo: string) => {
              const indexSegunda = jsonData.findIndex((row: any) => row[0] === 'Segunda Evaluación');
    
              const tableDataBefore = jsonData
                .slice(0, indexSegunda !== -1 ? indexSegunda : jsonData.length)
                .map((row: any) => [
                  row[0] || '', row[1] || '',
                  (row[2] === 1 || row[2] === '1') ? '/' : (row[2] === 0 || row[2] === '0') ? 'x' : (row[2] || ''),
                  row[3] || ''
                ]);
    
              const tableDataAfter = indexSegunda !== -1
                ? jsonData.slice(indexSegunda).map((row: any) => [
                    row[0] || '', row[1] || '',
                    row[2] === 1 ? '/' : row[2] === 0 ? 'x' : (row[2] || ''),
                    row[3] || ''
                  ])
                : [];
    
              const headersBefore = [['FACTOR 1', 'ÁREA DE DESEMPEÑO', 'EVALÚE A BASE DE', 'COMENTARIOS']];
              const headersAfter = [['ACTIVIDAD GENERAL', 'ACTIVIDADES ESPECÍFICAS', 'EVALÚE A BASE DE', 'COMENTARIOS']];
    
              doc.addPage();
              doc.addImage(logoImg, 'PNG', 10, 10, 30, 30);
              doc.setFontSize(12);
              doc.text(titulo, 80, 20);
              doc.setFontSize(10);
              doc.text(`Evaluador: ${evaluacion.evaluador}`, 10, 40);
              doc.text(`Evaluado: ${evaluacion.evaluado}`, 10, 50);
              doc.text(`Mes: ${evaluacion.mes_evaluacion}`, 10, 55);
    
              autoTable(doc, {
                startY: 65,
                head: headersBefore,
                body: tableDataBefore,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [0, 102, 204] },
                didDrawCell: (data) => {
                  const cellText = data.row.cells[2].text.join('');
                  if (data.column.index === 2 && cellText === '/') {
                    doc.addImage(checkImg, 'PNG', data.cell.x + 2, data.cell.y + 2, 5, 5);
                  }
                  if (data.column.index === 2 && cellText === 'x') {
                    doc.addImage(crossImg, 'PNG', data.cell.x + 2, data.cell.y + 2, 5, 5);
                  }
                }
              });
    
              if (indexSegunda !== -1 && tableDataAfter.length > 0) {
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
                      doc.addImage(checkImg, 'PNG', data.cell.x + 2, data.cell.y + 2, 5, 5);
                    }
                  }
                });
              }
            };
    
            // Procesar ambas evaluaciones
            procesarEvaluacion(doc, json1, evaluacion1, 'Primera Evaluación');
            procesarEvaluacion(doc, json2, evaluacion2, 'Evaluación del Jefe Directo');
    
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          },
          error: (err) => {
            console.error('Error al cargar archivos:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al combinar evaluaciones', life: 3000 });
          }
        });
      };
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, Falta por Completar Evaluaciones', life: 3000 });

    }
    }
  
    

}
