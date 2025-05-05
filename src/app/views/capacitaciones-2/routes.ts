import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'',
        data: {
            title:'capacitaciones'
        },
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: 'calendario',
                loadComponent: () => import('./capacitaciones-2.component').then(m => m.Capacitaciones2Component),
                data: {
                  title: 'calendario'
                }
              },
            {
                path: 'subir-evidencias',
                loadComponent: () => import('./subir-evidencia/subir-evidencia.component').then(m => m.SubirEvidenciaComponent),
                data: {
                  title: 'subir evidencias'
                }
              },
        ]
      }]