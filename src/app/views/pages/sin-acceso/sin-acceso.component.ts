import { Component } from '@angular/core';
import { ContainerComponent, RowComponent, ColComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-sin-acceso',
  imports: [ContainerComponent,RowComponent,ColComponent,InputGroupComponent,InputGroupTextDirective, FormControlDirective, ButtonDirective],
  templateUrl: './sin-acceso.component.html',
  styleUrl: './sin-acceso.component.scss'
})
export class SinAccesoComponent {

}
