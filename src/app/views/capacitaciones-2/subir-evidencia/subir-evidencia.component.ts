import { Component, OnInit } from '@angular/core';
import { evidenciasCapacitaciones } from '../evidencias-capacitaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { delay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-subir-evidencia',
  imports: [CommonModule, ToastModule ],
  templateUrl: './subir-evidencia.component.html',
  styleUrl: './subir-evidencia.component.scss'
})
export class SubirEvidenciaComponent implements OnInit {
  usuario: any;
  fecha: any;
  // es la evidencia actual de esa fecha del dia
  evidenciaActual: any;
  loading: boolean = false;
  cargando:boolean = false; // Mostrar spinner

  archivoUrl: any = '';
esImagen: boolean = false;

  constructor (private evidenciasCapacitaciones:evidenciasCapacitaciones, private fb:FormBuilder, private activatedRouter:ActivatedRoute,
     private messageService:MessageService, private sanitizer: DomSanitizer) {

  }
  archivoSeleccionado: any;
  formEvidencia!:FormGroup
  fechaActual: Date = new Date(); // Captura la fecha al cargar

  ngOnInit(): void {
    

    this.activatedRouter.queryParams.subscribe((res)=>{
      this.fecha = res['fecha'];
      // console.log(this.fecha);
    })
    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);


    this.formEvidencia = this.fb.group({
      usuario_id: [this.usuario.id, Validators.required],
      nombre_capacitacion: ['ejemplo', [Validators.required, Validators.maxLength(255)]],
      archivo: ['ejemplo.pdf', Validators.required],  // Aquí irá la URL o ruta del archivo
      descripcion: [''],  // Opcional, sin validaciones
      fecha_subida: ['', Validators.required],
      fecha_capacitacion: ['', Validators.required],
      evaluador_id: [] , // Opcional,
      estatus:['Pendiente',]
    });

    this.obtenerEvidenciasPorUsuario_id()
  }

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }
  
  subirArchivo() {
    const usuario_id = this.formEvidencia.get('usuario_id')?.value;
    const data = new FormData(); // Usar FormData para enviar el archivo
    const evaluador_id = this.formEvidencia.get('evaluador_id')?.value; // Asignar un valor predeterminado si es null

    data.append('usuario_id', usuario_id);
    data.append('nombre_capacitacion', this.formEvidencia.get('nombre_capacitacion')?.value);
    data.append('archivo', this.archivoSeleccionado); // Aquí agregas el archivo
    data.append('descripcion', this.formEvidencia.get('descripcion')?.value);
    data.append('fecha_subida', this.formEvidencia.get('fecha_subida')?.value);
    data.append('estatus', 'Pendiente');
    data.append('fecha_capacitacion', this.fecha);
    // data.append('evaluador_id', evaluador_id);
  
    // Llamar al servicio para subir el archivo
    this.evidenciasCapacitaciones.guardarAreaOportunidad(data).pipe(
      delay(150)
    ).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Se Subio tu Evidencia con Exito' });
        this.cargando = true; // Mostrar spinner
        setTimeout(() => {
          this.obtenerEvidenciasPorUsuario_id();
          this.cargando = false; // Quitar spinner
          this.loading = true;   
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
        this.cargando = false;

      }
    });
  }

  obtenerEvidenciasPorUsuario_id(){
    this.cargando = true

    this.evidenciasCapacitaciones.obtenerEvidenciasPorUsuarioId(Number(this.usuario.id)).pipe(
      delay(300)
    ).subscribe({
      next:(res)=>{
        console.log(res)
        if(res.success){

          const evidenciasFiltradas = res.data.filter((evidencia: any) => {
            const fechaEvidencia = evidencia.fecha_capacitacion;  // Cortamos la fecha a solo "YYYY-MM-DD"
            return fechaEvidencia === this.fecha;  // Comparamos
          });
          this.cargando = false

          this.evidenciaActual = evidenciasFiltradas
          console.log(this.evidenciaActual.length)
          // console.log(evidenciasFiltradas[0])
          // console.log(this.evidenciaActual)
  
        }
      }
    })
  }

  
abrirModal() {
  const archivo = this.evidenciaActual[0]?.archivo; // Aquí deberías tener la URL
  if (archivo) {
    this.archivoUrl = this.sanitizarUrl(archivo); // Sanitizamos
    this.esImagen = archivo.toLowerCase().endsWith('.jpg') || archivo.toLowerCase().endsWith('.jpeg') || archivo.toLowerCase().endsWith('.png');

    // Abre el modal (con Bootstrap 5)
    const modal = new (window as any).bootstrap.Modal(document.getElementById('evidenciaModal'));
    modal.show();

  }
}

sanitizarUrl(url: string) {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
  

}
