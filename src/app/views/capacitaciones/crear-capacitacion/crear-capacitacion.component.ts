import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload, UploadEvent } from 'primeng/fileupload';

import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CapacitacionesService } from '../capacitaciones.service';
import { ToasterHostDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { retryWhen, switchMap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview'; // Asegúrate de importar este módulo
import { CrearCapacitacionCgpowerComponent } from '../crear-capacitacion-cgpower/crear-capacitacion-cgpower.component';
import {CrearCapacitacionLiderComponent} from '../crear-capacitacion/crear-capacitacion-lider/crear-capacitacion-lider.component'
import { CompartirDatosService } from '../crear-capacitacion-cgpower/compartir-datos.service';
import {NumeroVecesLiderEvaluadoComponent} from '../crear-capacitacion/numero-veces-lider-evaluado/numero-veces-lider-evaluado.component';
@Component({
  selector: 'app-crear-capacitacion',
  imports: [ButtonModule,
     CommonModule,
     ToastModule,
     TabsModule,
      CrearCapacitacionCgpowerComponent,
      //  CrearCapacitacionLiderComponent,
      NumeroVecesLiderEvaluadoComponent
       ],
  providers: [MessageService],
  templateUrl: './crear-capacitacion.component.html',
  styleUrl: './crear-capacitacion.component.scss'
})
export class CrearCapacitacionComponent implements OnInit {




  mes: string = '';
  // vendra el arreglo de jefe directo
  jefeDirecto:any = []
  formEvaluacion:FormGroup
  usuario: any;
  urlArchivo: string = '';
  fileName:string = ''
  datosUsuario: any;
  mensajesNoPuedesEvaluarLider: boolean = false;
  
  constructor (private routerActivated:ActivatedRoute, private fb:FormBuilder,
    private capacitacionesService:CapacitacionesService, private messageService:MessageService,
    private router:Router, private compartirDatosService:CompartirDatosService
  ) {

    this.formEvaluacion = this.fb.group({
      mes_evaluacion: [this.mes, []],
      archivo: [, []],
      descripcion: ['Evaluacion', []],
      estatus: ['pendiente', []],
      usuario_id: [, this.usuario?.id, []],
      usuario_evaluador_id: [this.usuario?.id, []],
      usuario_evaluado_id: [this.jefeDirecto?.jefe_id, []],
      tipo_evaluacion: ['', []],
    })
  }



  ngOnInit(): void {
    this.routerActivated.queryParams.subscribe(
      paramas => {
        this.mes = paramas['mes'];
      }
    )

    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);
    this.getJefeDirecto()

    
    this.capacitacionesService.getInfoForId(this.usuario.id).subscribe((res)=>{
      this.datosUsuario = res.data?.rol
      // console.log(this.datosUsuario)
    })
  }
  //
  getJefeDirecto(){
    this.capacitacionesService.getJefeDirecto(this.usuario.id).subscribe({
      next:(res)=>{
        console.log(res)
        if(res.message){
          this.jefeDirecto = ''
          // console.log('no tiene jefe directo')
        }else{
          this.jefeDirecto = res
        }
        if(res.jefe_id == null || res.jefe_id == ''){
          // console.log('jefe',res.jefe_id)
          this.mensajesNoPuedesEvaluarLider = true
        }
        // console.log(this.jefeDirecto)
      }
    })
  }

  onBeforeUpload(event: any) {
    // Verifica si el archivo está vacío o no
    if (!event.files || event.files.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se selecciono archivo!'
      });
      event.preventDefault(); // Previene la subida
    }
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    this.fileName = file ? file.name : null;
  }

  uploadFile(fileUpload: any) {
    // console.log('archivo',fileUpload)
    // Verificar si un archivo ha sido seleccionado
    if (!fileUpload.files || fileUpload.files.length === 0) {
      // Si no se seleccionó un archivo, mostrar un mensaje de error
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor selecciona un archivo para subir.',
      });
    } else {
      // Si se seleccionó un archivo, continuar con la subida
      // fileUpload.upload();
      this.onUpload(fileUpload.files[0])
    }
  }

  // para subir el archivo de excel y todos los datos de la tabla evaluaciones
  //todo checar esto, no se manda a llamar la funcion
  onUpload(event:any){
    const file = event;
    this.fileName = file
    const urlArchivo = `https://magna.cgpgroup.mx/rhnet/archivos/capacitaciones2025/${file.name}`
    this.urlArchivo = urlArchivo
    // console.log('URL del archivo:', urlArchivo);

    if(!file){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falta que cargues el archivo', life: 3000 });
    }else{

      const formData = new FormData();
      formData.append('archivo', file);
      
      this.formEvaluacion.patchValue({archivo:urlArchivo})
      
      this.capacitacionesService.postSubirCapacitacion(formData).pipe(
  
        // switchMap(()=> { 
        //   return  this.capacitacionesService.postCapacitacion(this.data)
        
        // })
      ).subscribe({
        next:(res)=>{
          // console.log(res)
        },
        error:(err)=>{
          
        },
        complete:()=>{
          //mandar aviso de completado
          this.postCapacitacion();
          this.messageService.add({ severity: 'success', summary: 'Completado', detail: 'Se guardo la Informacion', life: 3000 });
          this.fileName= ''
          this.formEvaluacion.reset()

          //todo colocar que esta evaluada y validad obtener el get de la evaluacion para que ya este evaluada
        }
      })
    }
  }

  get data() {
    return {
        mes_evaluacion: this.mes,
        archivo: '',
        descripcion: `evaluacion del mes de ${this.mes}`,
        estatus: 'pendiente',
        usuario_id:this.usuario?.id,
        usuario_evaluador_id:this.usuario?.id,
        usuario_evaluado_id: this.jefeDirecto?.jefe_id,
        tipo_evaluacion: 'empleado'
    } 
  }
  //subir los datos a la tabla rh_evaluaciones
  postCapacitacion(){
    this.capacitacionesService.postCapacitacion(this.data).subscribe((res)=>{
    })
  }

  // lleva directo a la pagina para evaluar a lider
  IrAEvaluarLider(){
    this.router.navigate(['/evaluaciones/evaluar-lider'], {queryParams:{mes:this.mes}})

    //mandar los datos por servcio 
    this.compartirDatosService.setDatosPrivados(
      {
        data:this.data,
        evalua_a:this.jefeDirecto.jefe_nombre_completo,
        // datosUsuarioActual:this.departamentoUsuario
      }
    );
  }
}
