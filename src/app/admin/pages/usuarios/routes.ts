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
    path: 'todos',
    loadComponent: () => import('./usuarios.component').then(m => m.UsuariosComponent),
    data: {
      title:`Todos`
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

