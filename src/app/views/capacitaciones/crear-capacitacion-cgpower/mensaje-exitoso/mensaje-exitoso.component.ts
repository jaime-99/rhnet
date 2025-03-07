import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mensaje-exitoso',
  imports: [],
  templateUrl: './mensaje-exitoso.component.html',
  styleUrl: './mensaje-exitoso.component.scss'
})
export class MensajeExitosoComponent  implements OnInit{
  constructor (private router:Router) { }
  ngOnInit(): void {

  }


  irAInicio(){
    this.router.navigate(['/evaluaciones/'])
  }



}
