

import { Routes } from '@angular/router';

export const routes:Routes = [
    {
        path:'',
        data: {
            title:'vacaciones'
        },
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: '',
                loadComponent: () => import('./vacaciones.component').then(m => m.VacacionesComponent),
                data: {
                  title: 'uno'
                }
              },
            {
                path: 'dos',
                loadChildren: () => import('./vacaciones2/routes').then(m => m.routes),
                data: {
                  title: 'dos'
                }
              },
        ]
    }

]