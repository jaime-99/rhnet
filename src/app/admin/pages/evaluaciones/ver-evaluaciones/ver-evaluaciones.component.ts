import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../../../views/capacitaciones/capacitaciones.service';
import { Table, TableModule, } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import * as XLSX from 'xlsx'; // Librería para leer Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ver-evaluaciones',
  imports: [TableModule, CommonModule,ToastModule,FormsModule,DropdownModule, ButtonModule, TagModule,SelectModule,MultiSelectModule , InputTextModule,IconFieldModule, InputIconModule],
  templateUrl: './ver-evaluaciones.component.html',
  styleUrl: './ver-evaluaciones.component.scss'
})
export class VerEvaluacionesComponent implements OnInit {
  evaluaciones:any[] = [];
  searchValue: string ='';
  mesSeleccionado: string = '';
  ciudadSeleccionada: string = '';
  meses = [
    { label: 'Enero', value: 'Enero' },
    { label: 'Febrero', value: 'Febrero' },
    { label: 'Marzo', value: 'Marzo' },
    { label: 'Abril', value: 'Abril' },
    { label: 'Mayo', value: 'Mayo' },
    { label: 'Junio', value: 'Junio' },
    { label: 'Julio', value: 'Julio' },
    { label: 'Agosto', value: 'Agosto' },
    { label: 'Septiembre', value: 'Septiembre' },
    { label: 'Octubre', value: 'Octubre' },
    { label: 'Noviembre', value: 'Noviembre' },
    { label: 'Diciembre', value: 'Diciembre' },
    // agrega los demás meses
  ];
  ciudades: any = [];
  


  constructor (private capacitacionesService:CapacitacionesService,private http: HttpClient,private messageService:MessageService){ }
  ngOnInit(): void {
    this.obtenerEvaluaciones()
    this.obtenerCiudades();
    
  }


  obtenerEvaluaciones(){
    this.capacitacionesService.obtenerTodasLasEvaluaciones().subscribe({
      next:(res)=>{
        this.evaluaciones = res
        // console.log(this.evaluaciones.length)
      }
    })
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
    this.mesSeleccionado = '';
    this.ciudadSeleccionada = '';
}

getInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

// filterByMes(mes: string) {
//   this.dt1.filter(mes, 'mes_evaluacion', 'equals');
// }


verPDF(evaluacionseleccionada:any) {
 
  // console.log(evaluacionseleccionada);

  // Datos adicionales
  const nombreEvaluador = evaluacionseleccionada.evaluador;
  // const fecha = this.evaluacion.fecha_creacion;
  const evaluado =evaluacionseleccionada.evaluado;
  const mes = evaluacionseleccionada.mes_evaluacion;
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
    this.http.get(evaluacionseleccionada.archivo, { responseType: 'arraybuffer' }).subscribe(
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
        // doc.text(`Fecha: ${fecha}`, 10, 45);
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al abrir el archivo. consulta con Sistemas', life: 3000 });
      }
    );
  };
}


obtenerCiudades(){
  this.capacitacionesService.obtenerCiudades().subscribe((res)=>{
    this.ciudades = res
    console.log(this.ciudades);
  })
}

}
