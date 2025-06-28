import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface UserData {
  id: number;
  office: string;
  description: string;
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
    CommonModule,
  ],
  templateUrl: './ofitab.component.html',
  styleUrl: './ofitab.component.css'
})

export class OfitabComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['office', 'description'];
  dataSource = new MatTableDataSource<UserData>([]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  oficinas: any;

  constructor(
    private route: Router,

  ) { }

 ngOnInit(): void {
  const lstBranchString = localStorage.getItem('lstBranch');
  console.log('Valor de lstBranch en localStorage:', lstBranchString);

  if (lstBranchString) {
    this.dataSource.data = JSON.parse(lstBranchString);

    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      const dataStr = (data.office + ' ' + data.description).toLowerCase();
      return dataStr.includes(filter);
    };
  } else {
    console.warn('No se encontró lstBranch en localStorage');
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


  seleccionRow(row: any) {
  localStorage.setItem("BRANCHES", JSON.stringify(row));
  this.route.navigate(["/dashboard"]);
}
}