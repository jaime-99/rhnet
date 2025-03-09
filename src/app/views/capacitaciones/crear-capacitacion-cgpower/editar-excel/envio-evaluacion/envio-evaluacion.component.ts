import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CapacitacionesService } from '../../../capacitaciones.service';
 
@Component({
  selector: 'app-envio-evaluacion',
  imports: [ConfirmDialogModule, ToastModule, ButtonModule],
  templateUrl: './envio-evaluacion.component.html',
  styleUrl: './envio-evaluacion.component.scss'
})
export class EnvioEvaluacionComponent implements OnInit {

  public urlArchivo = `https://rhnet.cgpgroup.mx/archivos/capacitaciones2025/`

  constructor (private http:HttpClient, private confirmationService: ConfirmationService,  private messageService: MessageService,
    private router:Router, private capacitacionesService:CapacitacionesService
  ) {}
  ngOnInit(): void {
    // console.log('desde envio de evaluacion',this.datosEvaluaciones)
    // console.log('desde envio de evaluacion kpi',this.datosKpi)
    console.warn('primedio envio de evaluacion excel',this.datosEvaluaciones)
  }

  @Input() datosEvaluaciones:any
  @Input() datosExcel:any
  @Input() datosKpi:any
  @Input() promedio: number = 0; // Recibir el promedio del padre

  enviarEvaluacion(){
    this.saveAndSendExcel()
    this.postCapacitacion()
  }


  // saveAndSendExcel() {
  //   // Crear un nuevo workbook
  //   const newWorkbook = XLSX.utils.book_new();
  
  //   // Convertir excelData a una hoja de Excel
  //   const excelSheet = XLSX.utils.aoa_to_sheet(this.datosExcel);
  //   XLSX.utils.book_append_sheet(newWorkbook, excelSheet, "Evaluación");
  
  //   // Convertir kpiData a una hoja de Excel
  //   const kpiSheet = XLSX.utils.aoa_to_sheet(this.datosKpi);
  //   XLSX.utils.book_append_sheet(newWorkbook, kpiSheet, "KPI");
  
  //   // Generar un archivo en formato XLSX
  //   const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  
  //   // Convertir el buffer a un Blob
  //   const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  //   // Convertir el Blob en un archivo válido
  //   const file = new File([dataBlob], "evaluacion_editada.xlsx", { type: dataBlob.type });
  
  //   // Crear un FormData y adjuntar el archivo
  //   const formData = new FormData();
  //   formData.append("file", file);
  
  //   console.log(formData.get("file")); // Verifica si el archivo se está agregando correctamente
  
  //   // Enviar al backend
  //   this.http.post("https://rhnet.cgpgroup.mx/endpoints/capacitaciones/subirArchivoExcel.php", formData).subscribe(
  //     (response) => {
  //       console.log("Archivo enviado con éxito", response);
  //       alert("Archivo enviado correctamente");
  //     },
  //     (error) => {
  //       console.error("Error al enviar el archivo", error);
  //     }
  //   );
  // }
  
  saveAndSendExcel() {
    // Crear una copia de datosExcel para no modificar el original
    let datosCombinados = [...this.datosExcel];
    // Agregar una fila vacía para separación
    datosCombinados.push([]);
    // Agregar la fila que indica la segunda evaluación
    datosCombinados.push(['Segunda Evaluación']);
    // Agregar datos de KPI después de la separación
    datosCombinados = datosCombinados.concat(this.datosKpi);
    // Obtener el promedio calculado con la función existente
    const average = this.promedio;
    const percentage = (average * 100).toFixed(2) + '%'; // Redondear a dos decimales
    // Agregar el promedio al final de todo
    datosCombinados.push([]);
    datosCombinados.push(['Promedio Final', percentage]);
    // Crear un nuevo workbook
    const newWorkbook = XLSX.utils.book_new();

    // Convertir datos combinados en una sola hoja de Excel
    const excelSheet = XLSX.utils.aoa_to_sheet(datosCombinados);
    XLSX.utils.book_append_sheet(newWorkbook, excelSheet, "Evaluación");

    // Generar un archivo en formato XLSX
    const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });

    // Convertir el buffer a un Blob
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Convertir el Blob en un archivo válido
    const nombreArchivo = `Evaluacion-${this.datosEvaluaciones.data.mes_evaluacion}-${this.datosEvaluaciones.usuarioAEvaluar.nombre_usuario}.xlsx`;  // Puedes personalizar el nombre
    
    const file = new File([dataBlob], nombreArchivo, { type: dataBlob.type });
    // Crear un FormData y adjuntar el archivo
    const formData = new FormData();
    formData.append("file", file);

    // console.log(formData.get("file")); // Verifica si el archivo se está agregando correctamente
    this.urlArchivo = this.urlArchivo +  nombreArchivo
    // Enviar al backend
    this.http.post("https://rhnet.cgpgroup.mx/endpoints/capacitaciones/subirArchivoExcel.php", formData).subscribe(
        (response) => {
            console.log("Archivo enviado con éxito", response);
            alert("Archivo enviado correctamente");
        },  
        (error) => {
            console.error("Error al enviar el archivo", error);
        }
    );
}

confirm1(event: Event) {
  this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Enviar Evaluacion?',
      header: 'Confirmar',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Save',
      },
      accept: () => {
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
          this.enviarEvaluacion()
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

//funcion para enviar los datos
get data() {
  return {
      mes_evaluacion: this.datosEvaluaciones?.data.mes_evaluacion,
      archivo: this.urlArchivo,
      descripcion: `evaluacion del mes de ${this.datosEvaluaciones?.data.mes_evaluacion}`,
      estatus: 'pendiente',
      usuario_id:this.datosEvaluaciones.data.usuario_id,
      usuario_evaluador_id:this.datosEvaluaciones.data.usuario_evaluador_id,
      usuario_evaluado_id:this.datosEvaluaciones.data?.usuario_evaluado_id ,
      tipo_evaluacion: this.datosEvaluaciones?.data.tipo_evaluacion
  } 
}

postCapacitacion(){
  this.capacitacionesService.postCapacitacion(this.data).subscribe((res)=>{
    // console.log(res)
    // location.reload()
    this.router.navigate(['./evaluaciones/mensaje-exitoso'])
  })
}
}
