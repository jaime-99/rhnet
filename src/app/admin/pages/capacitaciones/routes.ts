import { Routes } from '@angular/router';

export const routes: Routes = [

{
  
    path:'',
    data: {
        title:'Capacitaciones'
    },
    children: [
        {
            path: '',
            redirectTo: '',
            pathMatch: 'full'
        },
  {
    path: 'capacitaciones',
    loadComponent: () => import('./capacitaciones.component').then(m => m.CapacitacionesComponent),
    data: {
      title:`Capacitaciones`
    }
  },
  {
    path: 'asignar-cursos',
    loadComponent: () => import('./asignar-cursos/asignar-cursos.component').then(m => m.AsignarCursosComponent),
    data: {
      title:`asignar cursos`
    }
  },
//   {
//     path: 'crear',
//     loadComponent: () => import('./crear/crear.component').then(m => m.CrearComponent),
//     data: {
//       title:`crear`
//     }
//   }
    ]
}]

