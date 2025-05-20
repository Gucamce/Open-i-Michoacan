import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegistroComponent } from '../registro/registro.component';

export interface ExampleTab {
  label: string;
  content: string;
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}


/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-usertab',
  standalone: true,
  imports: [
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
export class UsertabComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'editar', 'eliminar'];
  dataSource: MatTableDataSource<UserData>;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor (private _matDialog:MatDialog){

    const users = Array.from ({ length: 100}, (__, k) => createNewUser(k+1));
    this.dataSource = new MatTableDataSource(users)

  }
  editUsuario(){
    this._matDialog.open(RegistroComponent)
  }

  ngAfterViewInit() {
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
}
/** Builds and returns a new user. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))];
  const fruit =
    FRUITS[Math.round(Math.random() * (FRUITS.length - 1))] +
    ' ' +
    FRUITS[Math.round(Math.random() * (FRUITS.length - 1))];
  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}
