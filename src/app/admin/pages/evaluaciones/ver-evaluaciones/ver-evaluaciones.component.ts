import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../../../views/capacitaciones/capacitaciones.service';
import { Table, TableModule, } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-ver-evaluaciones',
  imports: [TableModule, CommonModule,FormsModule,DropdownModule, ButtonModule, TagModule,ProgressBar,SelectModule,MultiSelectModule , InputTextModule,IconFieldModule, InputIconModule],
  templateUrl: './ver-evaluaciones.component.html',
  styleUrl: './ver-evaluaciones.component.scss'
})
export class VerEvaluacionesComponent implements OnInit {
  evaluaciones:[] = [];
  searchValue: string ='';
  mesSeleccionado: string = '';
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  


  constructor (private capacitacionesService:CapacitacionesService){ }
  ngOnInit(): void {
    this.obtenerEvaluaciones()
  }


  obtenerEvaluaciones(){
    this.capacitacionesService.obtenerTodasLasEvaluaciones().subscribe({
      next:(res)=>{
        this.evaluaciones = res
        // console.log(this.evaluaciones.length)
      }
    })
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
}

getInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

}
