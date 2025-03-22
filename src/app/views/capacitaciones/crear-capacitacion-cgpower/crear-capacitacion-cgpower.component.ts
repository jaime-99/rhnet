import { Component, Input, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapacitacionesService } from '../capacitaciones.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//servicios locales 
import {CompartirDatosService} from './compartir-datos.service'
@Component({
  selector: 'app-crear-capacitacion-cgpower',
  imports: [ToastModule,
    //  FileUpload
     ButtonModule,
      CommonModule, ButtonModule
      , CommonModule, ToastModule, 
    ReactiveFormsModule
  ],
  templateUrl: './crear-capacitacion-cgpower.component.html',
  styleUrl: './crear-capacitacion-cgpower.component.scss'
})
export class CrearCapacitacionCgpowerComponent implements OnInit {
  @Input() esLider:any
  formEvaluacion: FormGroup
  mes: string = '';
  usuario: any;
  jefeDirecto: any;
  fileName: any;
  urlArchivo: string = '';
  datosUsuario: any;
  misEmpleados: any[] =[];

  misEvaluaciones:any[] = []
  //son los datos del usuario actual
  public departamentoUsuario:any=''

  //son los datos del usuario a evaluar 
  public usuarioAEvaluar: any;
  archivoDescargaUrl: string = '';
  // es para ver las evaluaciones que una persona hara a sus empleeados y ver si esta pendiente
  evaluacionesPendientes:any [] = [];
  // es para ver las las evaluaciones de una persona y ver si esta sin estatus significa que falta por evaluar
  evaluacionesSinEstatus: any[] = [];
  // es un boolean y veremos si una persona como jefe ya ha evaluado a todos sus empleados 
  todasPendientes: boolean= false;
  //simulacion de carga
  isLoading: boolean = false;


  constructor(private fb:FormBuilder, private capacitacionesService:CapacitacionesService, private messageService:MessageService,
    private routerActivated: ActivatedRoute,  private router:Router,
    private compartirDatosService:CompartirDatosService
  ){
    this.formEvaluacion = this.fb.group({
      mes_evaluacion: [this.mes, []],
      archivo: [, []],
      descripcion: ['Evaluacion', []],
      estatus: ['pendiente', []],
      usuario_id: [ '', []],
      usuario_evaluador_id: ['' ,[]],
      usuario_evaluado_id: ['', Validators.required],
      tipo_evaluacion: ['', []],
    })

    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);
  }
  ngOnInit(): void {

    this.routerActivated.queryParams.subscribe(
      paramas => {
        this.mes = paramas['mes'];
      }
    )

    // const usuarioData:any = localStorage.getItem('usuario');
    // this.usuario = JSON.parse(usuarioData);
    this.getJefeDirecto()
    this.getMisEmpleados()
    this.getInfoDepartamentoYPuesto()
    this.getEvaluacionesDeMisEmpleados()
  }

  getJefeDirecto(){
    this.capacitacionesService.getJefeDirecto(this.usuario.id).subscribe({
      next:(res)=>{
        this.jefeDirecto = res
        // console.log(this.jefeDirecto)
      }
    })
  }
  getMisEmpleados(){
    this.capacitacionesService.getMisEmpleados(this.usuario.id).subscribe({
      next:(res)=>{
        console.log('primer empleados',res)
        this.misEmpleados = res.data || []
      }
    })
  }

  // es para obtener el departamento y el puesto de usuario
  getInfoDepartamentoYPuesto(){
    this.capacitacionesService.getinfoPuestoYDepartamentoPorId(this.usuario.id).pipe(
    ).subscribe({

      next:(res)=>{
        this.departamentoUsuario = res 
      },
      complete:()=>{
        this.getInfoDepartamentoYPuestoParaEvaluado()
      }
    })
  }

  // es para obtener el id del evaluado y en ese momento obtener su puesto para descargar el excel adecuado
  getInfoDepartamentoYPuestoParaEvaluado() {
    this.formEvaluacion.get('usuario_evaluado_id')?.valueChanges.subscribe((idUsuario) => {
      if (idUsuario) {
        this.capacitacionesService.getinfoPuestoYDepartamentoPorId(idUsuario).subscribe((res) => {
          // console.log('Datos del usuario seleccionado:', res);
          // Aquí puedes asignar los datos a variables del componente si necesitas mostrarlos en la vista
          // this.usuarioSeleccionado = res;
          this.usuarioAEvaluar = res
          //todo  hacer un switch
          // console.log('usuario a evaluar', res)
          // console.log(res.puesto)
          switch (res.puesto) {
            case 'Auxiliar de Recursos Humanos':
                let nombreArchivo1 = "Evaluación Desempeño Auxiliar de Recursos Humanos Actualizada feb25.xlsx";
                this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo1)}`;
              break;

                case 'soporte tecnico' :
                  let nombreArchivo2 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo2)}`;
              break;

                case 'Analista Financiero' :
                  let nombreArchivo3 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo3)}`;
              break;

                case 'Auxiliar Administrativo' :
                  let nombreArchivo4 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo4)}`;
              break;

                case 'Gerente Nacional Administrativa' :
                  let nombreArchivo5 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo5)}`;
              break;

                case 'Gerente Comercial' :
                  let nombreArchivo6 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo6)}`;
              break;

                case 'Gerente Comercial Sr' :
                  let nombreArchivo7 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo7)}`;
              break;

                case 'Gerente Comercial Jr' :
                  let nombreArchivo8 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo8)}`;
              break;

                case 'Auxiliar Comercial' :
                  let nombreArchivo9 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo9)}`;

              break;

                case 'Auxiliar de materiales' :
                  let nombreArchivo10 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo10)}`;
              break;

                case 'Ingeniero de Materiales' :
                  let nombreArchivo11 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo11)}`;
              break;

                case 'Generalista de Recursos Humanos' :
                  let nombreArchivo12 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo12)}`;
              break;

                case 'Diseñadora' :
                  let nombreArchivo14 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo14)}`;
              break;

                case 'Coordinadora de Digital Media' :
                  let nombreArchivo15 = "Evaluación Desempeño Auxiliar Administrativa-Operaciones-Comercial.xlsx";
                  this.archivoDescargaUrl = `https://rhnet.cgpgroup.mx/archivos/evaluaciones_descargar/${encodeURIComponent(nombreArchivo15)}`;
              break;
            default:
              break;
          }
        });
      }
    });
  }
  


  onFileSelect(event:any){
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
  onUpload(file:any){
    // const filee = file;
    // this.fileName = file
    console.log(file.name)
    // return;
    const urlArchivo = `https://rhnet.cgpgroup.mx/archivos/capacitaciones2025/${file.name}`
    this.urlArchivo = urlArchivo
    // console.log('URL del archivo:', urlArchivo);

   
    if (!file || this.formEvaluacion.get('usuario_evaluado_id')?.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: !file
          ? 'Falta que cargues el archivo'
          : 'Falta que selecciones el usuario',
        life: 3000
      });
      return; // 🔴 Detiene la ejecución aquí
    }
    else{
      console.log('no la detuvo')
      this.isLoading = true; // Iniciar carga
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
          // this.postCapacitacion();
          // this.messageService.add({ severity: 'success', summary: 'Completado', detail: 'Se guardo la Informacion', life: 3000 });
          this.fileName= ''
          // this.formEvaluacion.reset() 
          
          setTimeout(() => {
            this.postCapacitacion();
            this.isLoading = false; // Detener carga cuando termine todo
          }, 4000);

        }
      })
    }
  }

  //es para ver si ya hice las evaluaciones de mis empleados si esta en null o pendiente la estatus de evaluacion
  getEvaluacionesDeMisEmpleados(){
    this.capacitacionesService.getEvaluacionesMisEmpelados(this.usuario.id,this.mes).pipe().subscribe({
      next:(res)=>{
        // console.log('evaluaciones',res)

        // mes actual 
          const mesActualNumero = new Date().getMonth();
          const meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
          const mesActualString = meses[mesActualNumero];

        this.misEvaluaciones = res || []

        this.evaluacionesPendientes = res.filter((e:any) => e.estatus_evaluacion === 'pendiente');
        this.evaluacionesSinEstatus = res.filter((e:any) => e.estatus_evaluacion === null );
        
        // console.log('meses actuales ' ,res.mes_evaluacion, this.mes)
        console.log(this.evaluacionesPendientes)
        // este valor es un booleano
        // si la quiero evaluar en enero y ya tiene de enero evaluado que no se pueda evaluar de nuevo
        //todo pendiente sin funcionar bien , debemos filtar por mes
        this.todasPendientes = res.length > 0 && res.every  ((e:any) => e.estatus_evaluacion === 'pendiente');
        console.log(this.todasPendientes)

      }
    })

  }

  get data() {
    return {
        mes_evaluacion: this.mes,
        archivo: this.urlArchivo,
        descripcion: `evaluacion del mes de ${this.mes}`,
        estatus: 'pendiente',
        usuario_id:this.usuario?.id,
        usuario_evaluador_id:this.usuario?.id,
        usuario_evaluado_id:Number(this.formEvaluacion.get('usuario_evaluado_id')?.value) ,
        tipo_evaluacion: 'empleado'
    } 
  }

  postCapacitacion(){
    // console.log(this.data)
    this.capacitacionesService.postCapacitacion(this.data).subscribe((res)=>{
      // location.reload()
      this.router.navigate(['./evaluaciones/mensaje-exitoso'])
    })
  }

  //! lo nuevo
  irEvaluar(){
    // es para que vaya al template de evaluacion y se enviara los datos desde aqui
    this.router.navigate(['./evaluaciones/editar-excel'], {queryParams: {mes:this.mes}} )
    this.compartirDatosService.setDatosPrivados(
      {
        data:this.data,
        usuarioAEvaluar:this.usuarioAEvaluar,
        datosUsuarioActual:this.departamentoUsuario
      }
    );
  }
  }