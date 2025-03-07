import { Routes } from "@angular/router";

export const routes:Routes = [

    {
        path:'',
        data: {
            title:'vacaciones 2'
        },
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: '',
                loadComponent: () => import('./vacaciones2.component').then(m => m.Vacaciones2Component),
                data: {
                  title: 'dos'
                }
              },
        ]
    }

]