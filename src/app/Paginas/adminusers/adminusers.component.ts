import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs'
import { UsertabComponent } from '../usertab/usertab.component';
import { MatSelectModule } from '@angular/material/select';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { OficinaServices } from '../../Servicios/oficinas.services';
import { FormGroup } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips'


export interface UserData {

  description: string;
  office: any;
}

interface NuevoUsuario {
  name: string;
  lastName: string;
  userName: string;
  password: string;
  idRol: string;
  sucursales: string;
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
    MatChipsModule,
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

export class AdminusersComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['office', 'description', 'check'];
  dataSource = new MatTableDataSource<any>([]);
  oficinasOriginal: any[] = [];
  oficinasFiltradas: any[] = [];
  oficinasSeleccionadas: any[] = [];

  matcher = new MyErrorStateMatcher();
  hide = true;
  rolSeleccionado: string = '';
  miFormulario!: FormGroup;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(

    private oficinaService: OficinaServices,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const jsonCatalogo = { tipo: 'oficinas' };
    this.getBranches();
    this.miFormulario = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: [''],
      password: ['', Validators.required], // Validators.minLength(6) Longitud de la contraseña
      idRol: ['', Validators.required],
      sucursales: [''],
    });

    this.miFormulario.get('name')?.valueChanges.subscribe(() => {
      this.generarNombreUsuario();
    });
    this.miFormulario.get('lastName')?.valueChanges.subscribe(() => {
      this.generarNombreUsuario();
    });
    this.miFormulario.get('idRol')?.valueChanges.subscribe((valor) => {
      if (valor === 'Administrador' || valor === 'Auditor') {
        this.seleccionarTodos();

      } else {
        this.oficinasSeleccionadas = [];
      }
      console.log('Rol seleccionado:', valor);
      console.log('Oficinas seleccionadas:', this.oficinasSeleccionadas);


    })
  }
  private respaldoSeleccion: any[] = []

  generarNombreUsuario(): void {
    const name = this.miFormulario.get('name')?.value || '';
    const lastName = this.miFormulario.get('lastName')?.value || '';
    if (name && lastName) {
      const sugerencia = `${name.charAt(0)}${lastName}`.toLowerCase().replace(/\s+/g, '');
      this.miFormulario.get('userName')?.setValue(sugerencia, { emitEvent: false });
    }
  }
  getBranches(): void {
    this.oficinaService.getBranches().subscribe({
      next: (res) => {
        this.oficinasOriginal = res;
        this.oficinasFiltradas = [...res];
        this.dataSource.data = this.oficinasFiltradas;
      },
      error: (err) => {
        console.log('Error al obtener las sucursales', err);

      }
    });

  }

  seleccionarTodos(): void {
    this.oficinasSeleccionadas = [...this.oficinasOriginal];
  }
  todasSeleccionadas: boolean = false;

  toggleSeleccionarTodas(): void {
    if (this.todasSeleccionadas) {

      //Deselecciona todas
      this.oficinasSeleccionadas = [];
    } else {
      //Selecciona todas
      this.oficinasSeleccionadas = [...this.oficinasFiltradas];
    }
    this.todasSeleccionadas = !this.todasSeleccionadas;
  }



  abrirModal() {
    this.respaldoSeleccion = [...this.oficinasSeleccionadas];
    const modalElement = document.getElementById('modalOficinas');
    if (modalElement) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: 'static',   // Evita cerrar por clic afuera
        keyboard: false       // Evita cerrar con ESC
      });
      bootstrapModal.show();
    }
  }

  estaSeleccionada(oficina: any): boolean {
    return this.oficinasSeleccionadas.some(o => o.office === oficina.office);
  }

  toggleOficina(oficina: any, checked: boolean): void {

    if (checked) {
      if (!this.oficinasSeleccionadas.some(o => o.office === oficina.office)) {
        this.oficinasSeleccionadas.push(oficina);
      }
    } else {
      this.oficinasSeleccionadas = this.oficinasSeleccionadas.filter(o => o.office !== oficina.office);
    }
    console.log('Oficinas seleccionadas:', this.oficinasSeleccionadas);

  }

  eliminarOficina(oficina: any): void {
    this.oficinasSeleccionadas = this.oficinasSeleccionadas.filter(o => o.office !== oficina.office);
  }

  cancelarSeleccion(): void {
    this.oficinasSeleccionadas = [...this.respaldoSeleccion];
    const modalElement = document.getElementById('modalOficinas');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
  onSubmit() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;

    }

    if (this.oficinasSeleccionadas.length === 0) {
      alert('Debes seleccionar al menos una oficina');
      return;
    }

    const name = this.miFormulario.get('name')?.value;
    const lastName = this.miFormulario.get('lastName')?.value;
    const password = this.miFormulario.get('password')?.value;
    const userName = this.miFormulario.get('userName')?.value;

    const idRolTexto = this.miFormulario.get('idRol')?.value;
    const idRol = this.obtenerIdRol(idRolTexto);

    const sucursales = this.oficinasSeleccionadas.map(o => o.office).join(',');

    const payload: NuevoUsuario = {
      userName,
      password,
      name,
      lastName,
      idRol: String(idRol),
      sucursales,
    };

    console.log('Enviando al back:', payload);

    this.oficinaService.registroUsuario(payload)
      .subscribe({
        next: (res) => {
          console.log('Usuario registrado correctamente:', res);
          this.cancelarFormulario();
        },
        error: (err: any) => {
          console.error('Error al registrar usuario:', err);
        }
      });
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


  filtrarOficinas(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.oficinasFiltradas = this.oficinasOriginal.filter(oficina =>
      oficina.description.toLowerCase().includes(valor) ||
      String(oficina.office).includes(valor)
    );
    this.dataSource.data = this.oficinasFiltradas;
  }

  guardarSeleccion(): void {
    const modalElement = document.getElementById('modalOficinas');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }

    this.respaldoSeleccion = [...this.oficinasSeleccionadas];

    console.log('Seleccionadas:', this.oficinasSeleccionadas);

  }
  cancelarFormulario(): void {
    this.miFormulario.reset();
    this.oficinasSeleccionadas = [...this.respaldoSeleccion];
  }


}
