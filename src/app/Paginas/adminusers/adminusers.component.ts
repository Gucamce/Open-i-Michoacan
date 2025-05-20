import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginService } from '../../Servicios/login.service';
import { Router } from '@angular/router';
import { MatTabsModule} from '@angular/material/tabs'
import { UsertabComponent } from '../usertab/usertab.component';
import { MatSelectModule } from '@angular/material/select';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { OficinaServices } from '../../Servicios/oficinas.services';

export interface UserData {
  id: string | number;
  description: string;
  office: string;
}

interface Oficina{ 
  id:string;
  description:string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-adminusers',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    MatCheckboxModule,
    MatTabsModule,
    UsertabComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    
  ],
  templateUrl: './adminusers.component.html',
  styleUrl: './adminusers.component.css'
})

export class AdminusersComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['id', 'description'];
  dataSource = new MatTableDataSource<UserData>([]);

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  hide = true;
  rolSeleccionado: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  oficinas: any;

  constructor(
    private loginService: LoginService,
    private route:Router,
    private oficinaService: OficinaServices,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const jsonCatalogo = {tipo: 'oficinas'};

   this.oficinaService.catalogos(jsonCatalogo).subscribe({
    next: (respuesta) => {
      console.log("Respuesta de la API:", respuesta);
      const oficinas = respuesta.TB_RESULTADO;
      
      this.dataSource = new MatTableDataSource(oficinas);
      
    },
    error: (error) => {
      console.error("Error al obtener oficinas:", error);
    }
  });

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
