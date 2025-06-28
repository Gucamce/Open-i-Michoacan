import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { OfitabComponent } from '../ofitab/ofitab.component';
import { OficinaServices } from '../../Servicios/oficinas.services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


export interface UserData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    CommonModule,
    OfitabComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{
  displayedColumns: string[] = ['office', 'description'];
  dataSource = new MatTableDataSource<any>([]);
  type: number = 0; //Rol de usuario

  input: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private oficinaService: OficinaServices,
    private route: Router,
  ){}
  
  ngOnInit(): void {
    const idRolStr = localStorage.getItem('idRol');
    this.type = idRolStr ? parseInt(idRolStr, 10) : 0;
    console.log('ROL guardado en localStorage:', localStorage.getItem('idRol'));
    
    this.getBranches();
  
  }

  getBranches(): void {
  this.oficinaService.getBranches().subscribe({
    next: (res) => {
      this.dataSource.data = res;

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const dataStr = `${data.office} ${data.description}`.toLowerCase();
        return dataStr.includes(filter);
      };
    },
    error: (err) => {
      console.log('Error al obtener las sucursales', err);
    }
  });
}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerIdRol(idRol: string): number {
    switch (idRol) {
      case 'Administrador':
        return 1;
      case 'Auditor':
        return 3;
      case 'Cajero':
        return 2;

      default:
        return 0;
    }
  }

  seleccionarOficina(oficina: any){
    localStorage.setItem("BRANCHES", JSON.stringify(oficina));
  this.route.navigate(["/dashboard"]);
  }

}
