import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-agregar-usuario-mes',
  imports: [CommonModule, ReactiveFormsModule, ToastModule,FormsModule,TagModule, TabsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, Toast],
  templateUrl: './agregar-usuario-mes.component.html',
  styleUrl: './agregar-usuario-mes.component.scss'
})
export class AgregarUsuarioMesComponent implements OnInit {
  usuarios:any[] = [];
  periodos: any;

  usuarioSeleccionado: number | null = null;
  periodoSeleccionado: number | null = null;
  usuariosPeriodos: any[] = [];

  selectedMonth: number = 0; // Para llevar el control de la pestaña seleccionada
  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio'];
  nombreMesActual: string = this.meses[0]; // enero por default

  //todo nuevo 
  // tabs: { title: string; value: number; content: string }[] = [];
  tabs: { title: string; value: number; content: any[] }[] = [];



  constructor (private adminService:AdminService, private messageService: MessageService) {}
  ngOnInit(): void {
    this.tabs = this.meses.map((mes, index) => ({
      title: mes,
      value: index,
      content: [] // luego llenamos con los usuarios
    }));

    // this.cargarUsuariosPorMes();

    // this.obtenerUsuarios();
    // this.cargarPeriodos();


  }


  obtenerUsuarios(){
    this.adminService.getAllUsers().subscribe({
      next:(res)=>{
        this.usuarios = res
        // console.log(res)
      }
    })
  }

  cargarPeriodos(){
    this.adminService.obtenerPeriodosEvaluacion().subscribe({
      next:(res)=>{
        this.periodos = res
        // console.log('periodos',res)
      }
    })

  }
  cargarUsuariosPorMes() {
    // console.log('llama')
    // Realiza una sola solicitud para obtener todos los usuarios
    this.adminService.obtenerUsuariosPeriodos().subscribe((res: any[]) => {
      // console.log('Datos obtenidos del backend:', res); // Verifica los datos
  
      // Itera a través de las tabs
      this.tabs.forEach((tab) => {
        // console.log('Filtrando para el mes:', tab.title.toLowerCase()); // Verifica el mes de cada tab
        // Filtra los usuarios para cada tab por el mes correspondiente
        tab.content = res.filter((usuario) => {
          // console.log('Comparando mes:', usuario.mes.toLowerCase(), 'con', tab.title.toLowerCase()); // Verifica la comparación
          return usuario.mes.toLowerCase() === tab.title.toLowerCase();
        });
  
        // console.log('Usuarios para el mes', tab.title, ':', tab.content); // Verifica los resultados filtrados
      });
    });
  }
  obtenerUsuariosDePeriodos(){
    this.adminService.obtenerUsuariosPeriodos().subscribe((res)=>{
      // this.usuariosPeriodos = res
      this.usuariosPeriodos = res
      // console.log('mes de ',this.usuariosPeriodos)
    })
  }
  clear(table: Table) {
    table.clear();
}

trackByTab(index: number, tab: { value: number }) {
  return tab.value;
}
// es para desactivar a alguien de un periodo en especifico
cambiarEstado(id:string,activo:number){

  const data = {
    id:Number(id),
    activo:activo
  }

  this.adminService.editarUsuarioPeriodo(data).subscribe({
    next:(res)=>{
      this.cargarUsuariosPorMes();
      this.messageService.add({ severity: 'success', summary: 'Finalizado', detail: 'Estado Actualizado Correctamente' });
    }
  })


}

// asignarUsuario() {
//   if (this.usuarioSeleccionado && this.periodoSeleccionado) {
//     // Aquí va la lógica para asignar el usuario al periodo
//     // console.log(`Asignando usuario ${this.usuarioSeleccionado} al periodo ${this.periodoSeleccionado}`);
//     this.adminService.agregarUsuarioAPeriodo(Number(this.usuarioSeleccionado), Number(this.periodoSeleccionado)).subscribe({
//       next:(res)=>{
//         if(res.error){
//           this.messageService.add({ severity: 'warn', summary: 'Error', detail: res.error });
//           this.cargarUsuariosPorMes();
//         }
//         else if(res.success){
//           this.messageService.add({ severity: 'success', summary: 'Exito', detail: res.success });
//           this.cargarUsuariosPorMes();
//         }
//       },
//       error:(err)=>{

//         this.messageService.add({ severity: 'warn', summary: 'Error', detail: err });


//       },
//       complete:()=>{

//       }
//     })
//   } else {
//     // console.log('Faltan campos por seleccionar');
//   }
// }


}


