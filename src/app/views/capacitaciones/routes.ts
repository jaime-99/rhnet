import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'',
        data: {
            title:'evaluaciones'
        },
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: '',
                loadComponent: () => import('./capacitaciones.component').then(m => m.CapacitacionesComponent),
                data: {
                  title: ''
                }
              },
            {
                path: 'evaluar',
                loadComponent: () => import('./crear-capacitacion/crear-capacitacion.component').then(m => m.CrearCapacitacionComponent),
                data: {
                  title: 'evaluar'
                }
              },
            {
                path: 'capacitacion-evaluador',
                loadComponent: () => import('./capacitacion-usuario-evaluador/capacitacion-usuario-evaluador.component').then(m => m.CapacitacionUsuarioEvaluadorComponent),
                data: {
                  title: 'evaluaciones del mes'
                },
          },
              
            {
                path: 'detalles',
                loadComponent: () => import('./capacitacion-usuario-evaluador/capacitacion-detalle/capacitacion-detalle.component').then(m => m.CapacitacionDetalleComponent),
                data: {
                  title: 'evaluacion detalle'
                },
            },
            {
                path: 'editar-excel',
                loadComponent: () => import('./crear-capacitacion-cgpower/editar-excel/editar-excel.component').then(m => m.EditarExcelComponent),
                data: {
                  title: 'edicion de excel'
                },
            },
            {
                path: 'evaluar-lider',
                loadComponent: () => import('./crear-capacitacion/crear-capacitacion-lider/crear-capacitacion-lider.component').then(m => m.CrearCapacitacionLiderComponent),
                data: {
                  title: 'evaluar lider'
                },
            },
            {
                path: 'area-oportunidad',
                loadComponent: () => import('./area-de-oportunidad/area-de-oportunidad.component').then(m => m.AreaDeOportunidadComponent),
                data: {
                  title: 'crear area de oportunidad'
                },
            },
            {
                path: 'ver-area-oportunidad-evaluado',
                loadComponent: () => import('./capacitacion-usuario-evaluador/evaluacion-para-mi/ver-area-oportunidad-evaluado/ver-area-oportunidad-evaluado.component').then(m => m.VerAreaOportunidadEvaluadoComponent),
                data: {
                  title: 'ver area de oportunidad'
                },
            },
            
            {
                path: 'mensaje-exitoso',
                loadComponent: () => import('./crear-capacitacion-cgpower/mensaje-exitoso/mensaje-exitoso.component').then(m => m.MensajeExitosoComponent),
                data: {
                  title: 'evaluacion detalle'
                },
              },
        ]
      }]