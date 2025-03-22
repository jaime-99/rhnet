import { Component, OnInit } from '@angular/core';
import { CompartirDatosService } from '../../crear-capacitacion-cgpower/compartir-datos.service';
import { CapacitacionesService } from '../../capacitaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';  // 👈 Importar FormsModule
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-capacitacion-lider',
  imports: [CommonModule,FormsModule, ReactiveFormsModule ],
  templateUrl: './crear-capacitacion-lider.component.html',
  styleUrl: './crear-capacitacion-lider.component.scss'
})
export class CrearCapacitacionLiderComponent implements OnInit {
  evaluaciones: any[] = [];
  datosEvaluacion:any = []

  public urlArchivo = `https://rhnet.cgpgroup.mx/archivos/capacitaciones2025/`
  mostrarMensaje: boolean = false;
  usuario: any = '';
  startIndex: number = 0;

  constructor (private compatirDatos:CompartirDatosService, private capacitacionesService:CapacitacionesService,
    private http:HttpClient, private router:Router ) {}
  ngOnInit(): void {

    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);
    
    this.datosEvaluacion = this.compatirDatos.getDatosPrivados()

    this.capacitacionesService.obtenerEvaluaciones().subscribe(data => {
      this.evaluaciones = this.capacitacionesService.procesarExcel(data);
      // Agregamos las columnas editables
      this.evaluaciones = this.evaluaciones.map(ev => ({
        ...ev,
        puntuacion: null,  // Inicialmente vacío
        comentario: ''     // Inicialmente vacío
      }));
      this.startIndex = this.evaluaciones.findIndex(ev => ev.__EMPTY === 'Comunicación');

      // const evaluacionFinal = this.getEvaluation();
      // const evaluacionGeneralIndex = this.evaluaciones.findIndex(ev => ev.__EMPTY_1  === 'Evaluación General');
  
      // if (evaluacionGeneralIndex !== -1) {
      //   this.evaluaciones[evaluacionGeneralIndex].puntuacion = evaluacionFinal;  // Asignamos la evaluación calculada
      // }
    });
  }

  getEvaluation(): string {
    if (!this.evaluaciones || this.startIndex === -1) return "Sin evaluación";

    const evaluacionesFiltradas = this.evaluaciones.slice(this.startIndex);

    const total = evaluacionesFiltradas.filter(ev => ev.puntuacion !== '').length; 
    const correctas = evaluacionesFiltradas.filter(ev => ev.puntuacion === '✔️').length;

    const porcentaje = (correctas / total) * 100; // Calcula el porcentaje de respuestas correctas

    if (porcentaje >= 70) {
      return `Aprobado (${porcentaje.toFixed(2)}%)`; // Aprobado si tiene 70% o más
    } else if (porcentaje >= 40) {
      return `Reprobado - Mejorar (${porcentaje.toFixed(2)}%)`; // Reprobado pero con posibilidad de mejorar
    } else {
      return `Desaprobado (${porcentaje.toFixed(2)}%)`; // Desaprobado si tiene menos del 40%
    }
  }

  exportToExcel(): void {
    // Filtramos la evaluación final para incluirla en la hoja
    const evaluacionesConEvaluacionFinal = [...this.evaluaciones];

    // Preparamos los datos que se exportarán
    const data = evaluacionesConEvaluacionFinal.map(ev => ({
      'Área de Evaluación': ev.__EMPTY,
      'Pregunta': ev.__EMPTY_1,
      'Puntuación': ev.puntuacion === '✔️' ? 'Aprobado' : ev.puntuacion === '❌' ? 'Reprobado' : ev.puntuacion,
      'Comentarios': ev.comentario,
    }));

     // Agregamos la fila de evaluación final
  const evaluacionFinal = this.getEvaluation();  // Calcula la evaluación final
  data.push({
    'Área de Evaluación': 'Evaluación Final',
    'Pregunta': '',
    'Puntuación': evaluacionFinal,
    'Comentarios': ''
  });

    // Crear un libro de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Agregar la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluacion-lider-1');
    // Generar un archivo en memoria como Blob
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const nombreArchivo = `Evaluacion-lider-${this.datosEvaluacion.data.mes_evaluacion}-${this.datosEvaluacion.evalua_a}.xlsx`;  // Puedes personalizar el nombre
    const file = new File([blob], nombreArchivo, { type: blob.type });

    // Crear el FormData y adjuntar el archivo
    const formData = new FormData();
    // formData.append('file', blob, 'Evaluacion-Lider.xlsx');
    formData.append("file", file);

    this.urlArchivo = this.urlArchivo +  nombreArchivo

    // Enviar el archivo al servidor
    this.enviarDatosExcel(formData);
  }

  // es para enviar los datos de excel a el servidor
  enviarDatosExcel(formData:FormData){
    // console.log(formData)
    this.http.post("https://rhnet.cgpgroup.mx/endpoints/capacitaciones/subirArchivoExcel.php", formData).subscribe(
      (response) => {
          // console.log("Archivo enviado con éxito", response);
          this.subirEvaluacionBD()
          alert("Archivo enviado correctamente");
      },  
      (error) => {
          // console.error("Error al enviar el archivo", error);
      }
  );


  }

  get data() {
    return {
        mes_evaluacion: this.datosEvaluacion?.data.mes_evaluacion,
        archivo: this.urlArchivo,
        descripcion: `evaluacion del mes de ${this.datosEvaluacion?.data.mes_evaluacion}`,
        estatus: 'pendiente',
        usuario_id:this.datosEvaluacion.data.usuario_id,
        usuario_evaluador_id:this.datosEvaluacion.data.usuario_evaluador_id,
        usuario_evaluado_id:this.datosEvaluacion.data?.usuario_evaluado_id ,
        tipo_evaluacion: 'jefe'
    } 
  }

  // es para subir la evaluacion a las BD 
  subirEvaluacionBD(){
    this.capacitacionesService.postCapacitacion(this.data).subscribe({
      next:(res)=>{
        //llevar a un mensaje de exito
      }
    })
    
    this.mostrarMensaje = true
  }

  irAEvaluacion(){
    // redigiremos a la evaluacion de ese mes 
    this.router.navigate(['./evaluaciones/capacitacion-evaluador'], {queryParams:{mes:this.data.mes_evaluacion}} )
  }
}
