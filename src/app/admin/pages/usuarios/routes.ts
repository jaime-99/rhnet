import { Routes } from '@angular/router';

export const routes: Routes = [

{
  
    path:'',
    data: {
        title:'Usuarios'
    },
    children: [
        {
            path: '',
            redirectTo: '',
            pathMatch: 'full'
        },
  {
    path: '',
    loadComponent: () => import('./usuarios.component').then(m => m.UsuariosComponent),
    data: {
      title:``
    }
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear.component').then(m => m.CrearComponent),
    data: {
      title:`crear`
    }
  }
    ]
}]

