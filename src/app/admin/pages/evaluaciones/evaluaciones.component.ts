import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import {AgregarUsuarioMesComponent} from './agregar-usuario-mes/agregar-usuario-mes.component'
@Component({
  selector: 'app-evaluaciones',
  imports: [TabsModule, AgregarUsuarioMesComponent],
  templateUrl: './evaluaciones.component.html',
  styleUrl: './evaluaciones.component.scss'
})
export class EvaluacionesComponent implements OnInit {

  constructor (){ }

  ngOnInit(): void {
  }

}
