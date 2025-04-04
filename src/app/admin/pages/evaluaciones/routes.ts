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
      title:``
    }
  },
    ]

}]