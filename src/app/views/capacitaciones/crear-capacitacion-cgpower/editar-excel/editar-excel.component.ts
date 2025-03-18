import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompartirDatosService } from '../compartir-datos.service';
import { EnvioEvaluacionComponent } from './envio-evaluacion/envio-evaluacion.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

declare var bootstrap: any; // Si usas Bootstrap 5

@Component({
  selector: 'app-editar-excel',
  imports: [FormsModule, CommonModule, EnvioEvaluacionComponent,ConfirmDialogModule  ],
  templateUrl: './editar-excel.component.html',
  styleUrl: './editar-excel.component.scss'
})
export class EditarExcelComponent implements OnInit {

  excelData:any =[];
  workbook: any;
  headers: string[] = [];
  // mes que se le pasa por queryparams
  mes: any;
  datosEvaluacion: any = [];
  usuario: any;
  kpiData: any[] =[];
  headers2: string[] = [];
  kpiAverage: number = 0;
  promedioFinal: number= 0;
  // es para mostrar el boton 
  mostrarBoton: boolean = false;
  comentariosIndex: number = 0;


  //para abrir modal de bootsrap 
  currentRowIndex: number | null = null;
  currentColIndex: number | null = null;
  currentComment: string = '';
  constructor (private http: HttpClient, private activatedRouter:ActivatedRoute, 
    private compartirDatosService: CompartirDatosService, private router:Router,
    private confirmationService: ConfirmationService,  private messageService: MessageService
   ) {

  }

  ngOnInit(): void {
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);

        this.promedioFinal = this.calculateCombinedAverage(); // Llamar la función para calcular el promedio

    this.activatedRouter.queryParams.subscribe((res)=>{
      this.mes = res['mes']
    })
    this.datosEvaluacion = this.compartirDatosService.getDatosPrivados()
    this.downloadExcel()
    // console.log( 'datos desde editar excel', this.datosEvaluacion)
    this.kpiAverage = this.calculateKpiAverage(); // Calcular al iniciar
    // console.log(this.datosEvaluacion?.usuarioAEvaluar?.puesto)
    }

 //todo correcto no borrar
  // downloadExcel() {
  //   this.http.get('https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/proxy.php', { responseType: 'arraybuffer' })
  //     .subscribe((data: ArrayBuffer) => {
  //       const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
  //       const sheetName = workbook.SheetNames[0];  // Tomamos la primera hoja
  //       const sheet = workbook.Sheets[sheetName];

  //       // Convertir el contenido a formato JSON
  //       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //       if (jsonData.length > 0) {
  //         this.headers = jsonData[0] as string[]; // Primera fila como encabezado
  //         this.excelData = jsonData.slice(1);  // El resto como contenido de la tabla
  //       }
  //     });
  // }
  downloadExcel() {
    const tipoEvaluacion = this.datosEvaluacion.usuarioAEvaluar.puesto;
    const encodedTipoEvaluacion = encodeURIComponent(tipoEvaluacion);
    const timestamp = new Date().getTime(); // Añadir un timestamp único para evitar caché
    const url = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/proxy2.php?tipo=${encodedTipoEvaluacion}&timestamp=${timestamp}`;

    this.http.get(url, { responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Convertir el contenido a formato JSON
        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        if (jsonData.length > 0) {
          // Buscar la fila donde están los encabezados correctos
          console.log('excel,',jsonData)
          const startIndex = jsonData.findIndex(row => 
            row.includes("FACTOR") && row.includes("ÁREA DE DESEMPEÑO") && row.includes("EVALÚE A BASE DE %") && row.includes('COMENTARIOS')
          );
  
          if (startIndex !== -1) {
            this.headers = jsonData[startIndex] as string[]; // Usar esta fila como encabezados
            this.excelData = jsonData.slice(startIndex + 1); // Tomar solo los datos desde ahí
            // Buscar la fila donde está "KPI'S"

            const kpiIndex = jsonData.findIndex(row => row.includes("KPI´S"));
            const comentariosIndex = jsonData.findIndex(row => row.includes("COMENTARIOS ADICIONALES:"));

            // console.log(this.excelData)

            if (kpiIndex !== -1) {
              this.excelData = jsonData.slice(startIndex + 1, kpiIndex); // Tomar solo hasta antes de KPI´S
              
              this.kpiData = jsonData.slice(kpiIndex + 2, comentariosIndex); // Saltar la fila de headers

              this.headers2 = jsonData[kpiIndex + 1] as string[]; // El siguiente conjunto de headers después de KPI´S

              const evalColumnIndex = this.headers2.indexOf("EVALÚE A BASE DE %");
                if (evalColumnIndex !== -1) {
                  this.kpiData.forEach(row => {
                    if (row[evalColumnIndex] === undefined) {
                      row[evalColumnIndex] = false;
                    }
                  });
                }
                
            } else {
              this.excelData = jsonData.slice(startIndex + 1); // Si no hay KPI´S, tomar todo después de los headers
              this.kpiData = [];
            }

          }
        }
      });
  }

  isMetricRow(row: any[]): boolean {
    return row.some(cell => typeof cell === 'string' && cell === 'MÉTRICO');
  }
  
  toggleEvaluation(i: number, j: number) {
    // Alternar entre true (✔️) y false (❌)
    this.excelData[i][j] = this.excelData[i][j] === 1 ? 0 : 1;

  }
  toggleKpiEvaluation(i: number, j: number) {
    // Cambiar el valor solo en la columna correspondiente a 'EVALÚE A BASE DE %'
    if (this.headers2[j] === 'EVALÚE A BASE DE %') {
      this.kpiData[i][j] = this.kpiData[i][j] === 1 ? 0 : 1; // Alternar entre ✔️ y ❌
    }
  }
  calculateAverage(): number {
    let total = 0;
    let count = 0;
    const evalColumnIndex = this.headers.indexOf("EVALÚE A BASE DE %");
  
    for (let i = 0; i < this.excelData.length; i++) {
      // Saltar la fila de "Promedio"
      if (this.excelData[i][1] && this.excelData[i][1].toString().toLowerCase() === "promedio") {
        continue;
      }
  
      const evalValue = this.excelData[i][evalColumnIndex];
  
      if (evalValue === 1) { // Ahora verificamos si es 1
        total += 1;
      }
  
      if (evalValue === 0 || evalValue === 1) { // Solo contar 0 y 1
        count += 1;
      }
    }
  
    return count === 0 ? 0 : total / count;
  }
  

  calculateKpiAverage(): number {
    let total = 0;
    let count = 0;
    // Obtener el índice de la columna "EVALÚE A BASE DE %"
    const evalColumnIndex = this.headers2.indexOf("EVALÚE A BASE DE %");

    if (evalColumnIndex === -1) {
        return 0; // Si la columna no existe, retornar 0
    }
    for (let i = 0; i < this.kpiData.length; i++) {
        const evalValue = this.kpiData[i][evalColumnIndex];
        // Solo contar valores que sean 0 o 1
        if (evalValue === 0 || evalValue === 1) {
            count += 1;
            total += evalValue; // Sumar solo los valores 1
        }
    }

    return count === 0 ? 0 : total / count;
}

  calculateCombinedAverage(): number {
    const average = this.calculateAverage();
    const kpiAverage = this.calculateKpiAverage();
  
    // Asegurarse de que los promedios no sean NaN o indefinidos
    if (isNaN(average) || isNaN(kpiAverage)) {
      return 0;  // Si alguno de los promedios es inválido, retornamos 0
    }
  
    // Sumar ambos promedios y dividir entre 2 para obtener el promedio combinado
    return (average + kpiAverage) / 2;
  }
  clearDefaultComment(i: number, j: number) {
    if (this.excelData[i][j] === 'ninguno') {
      setTimeout(() => { this.excelData[i][j] = ''; }, 0);
    }
  }
  // isKpiRow(row: any[]): boolean {
  //   return row.join(' ').toUpperCase().includes("KPI");
  // }

  guardarPromedio(value:boolean){
    // this.promedioFinal = this.calculateCombinedAverage()
    this.mostrarBoton = true
  }

  //abrir primer modal de bootsrap 
  openCommentModal(i: number, j: number) {
    this.currentRowIndex = i;
    this.currentColIndex = j;
    this.currentComment = this.excelData[i][j] !== 'ninguno' ? this.excelData[i][j] : '';
    
    // Abre el modal
    let myModal = new bootstrap.Modal(document.getElementById('commentModal'));
    myModal.show();
  }
  openCommentModalKpi(i: number, j: number) {
    this.currentRowIndex = i;
    this.currentColIndex = j;
    this.currentComment = this.kpiData[i][j] !== 'ninguno' ? this.kpiData[i][j] : '';
    
    // Abre el modal
    let myModal = new bootstrap.Modal(document.getElementById('commentModalKpi'));
    myModal.show();
  }

  saveComment() {
    if (this.currentRowIndex !== null && this.currentColIndex !== null) {
      this.excelData[this.currentRowIndex][this.currentColIndex] = this.currentComment;
    }
    // Cierra el modal
    let modalElement = document.getElementById('commentModal');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  saveCommentKpi() {
    if (this.currentRowIndex !== null && this.currentColIndex !== null) {
      this.kpiData[this.currentRowIndex][this.currentColIndex] = this.currentComment;
    }
    // Cierra el modal
    let modalElement = document.getElementById('commentModalKpi');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  
  confirm1(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Save',
        },
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Rejected',
                detail: 'You have rejected',
                life: 3000,
            });
        },
    });
}

confirm2(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
        },

        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
}
  }


