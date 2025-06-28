import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegistroComponent } from '../registro/registro.component';
import { CommonModule } from '@angular/common';
import { OficinaServices } from '../../Servicios/oficinas.services';

export interface UserData {
  id: string;
  name: string;
  lastName: string;
  userName: string;
  // email?: string;
}

@Component({
  selector: 'app-usertab',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './usertab.component.html',
  styleUrl: './usertab.component.css'
})

export class UsertabComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'lastName', 'userName', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<UserData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(

    private _matDialog: MatDialog,
    private oficinaServices: OficinaServices

  ) { }

  ngOnInit() {
    this.oficinaServices.getUsuarios().subscribe({
      next: (resp) => {
        console.log('respuesta de usuarios:', resp);

        this.dataSource.data = resp.data ?? resp;
        console.log('Eliminacion comlpleta');
        
      },
      error: (err) => {
        console.error('error al obtener usuarios', err);
      }
    });
  }

  /** Editar usuario existente */
  editUsuario(usuario: any) {
    const dialogRef = this._matDialog.open(RegistroComponent, {
      width: '500px',
      data: usuario
    });
    console.log(`Editar, respuesta:`, RegistroComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.oficinaServices.getUsuarios().subscribe(resp => {
          console.log('Usuario editado:', resp);
          this.dataSource.data = this.dataSource.data.map(user => user.id === result.id ? result : user);
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Filtro de búsqueda */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  eliminarUsuario(usuario: UserData) {
    
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.userName}?`)) {
      this.oficinaServices.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== usuario.id);
          console.log(`Usuario ${usuario.userName} eliminado`);
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
        }
      });
    }
  }
}
