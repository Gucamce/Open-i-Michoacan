import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OfficeService } from '../../Servicios/office.service';
import { LoginService } from '../../Servicios/login.service';
import { Router } from '@angular/router';

export interface UserData {
  id: number;
  description: string;
  office: string;
}


@Component({
  selector: 'app-ofitab',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './ofitab.component.html',
  styleUrl: './ofitab.component.css'
})

export class OfitabComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['Oficina', 'DESCRIPCION'];
  dataSource = new MatTableDataSource<UserData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  oficinas: any;

  constructor(
    private loginService: LoginService, private route:Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const arrOf = localStorage.getItem("BRANCH");

    this.oficinas= arrOf?JSON.parse(arrOf):[];
    console.log(this.oficinas);

    this.dataSource = this.oficinas
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  } 
  

  /** Applies the filter to the table data. */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  seleccionRow(row:any){
    console.log(row);
    this.route.navigate(["/dashboard"]),
    localStorage.setItem("oficinaseleccion",JSON.stringify(row))
  }
}