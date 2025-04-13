import { Routes } from '@angular/router';

export const routes: Routes = [

{
  
    path:'',
    data: {
        title:'Evaluaciones'
    },
    children: [
        {
            path: '',
            redirectTo: '',
            pathMatch: 'full'
        },
  {
    path: '',
    loadComponent: () => import('./evaluaciones.component').then(m => m.EvaluacionesComponent),
    data: {
      title:`permisos`
    }
  },
  {
    path: 'ver-evaluaciones',
    loadComponent: () => import('./ver-evaluaciones/ver-evaluaciones.component').then(m => m.VerEvaluacionesComponent),
    data: {
      title:`ver evaluaciones`
    }
  },
  {
    path: 'ver-formatos',
    loadComponent: () => import('./formato-evaluacion/formato-evaluacion.component').then(m => m.FormatoEvaluacionComponent),
    data: {
      title:`Formatos`
    }
  },
    ]

}]