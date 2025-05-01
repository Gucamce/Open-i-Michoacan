import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DummiesService } from '../../Servicios/dummies.services';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface ArbolNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class
    this.dummiesServices.catBusquedaAgente().subscribe((responseData: any) => {
      console.log (responseData);

      let array:any [] = [];
      const resultado = responseData.map((item:any) => ({
        name: item.descripcion,
        children: item.anio.map((anio:any) => ({
          name: anio.descripcion,
          children: anio.mes.map((mes:any) => ({
            name: mes.descripcion
          }))
        }))
      }));
      
      console.log(resultado);
      this.dataSource.data = resultado;
      console.log(this.dataSource.data);

    });
  }

  treeControl = new FlatTreeControl<ArbolNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private dummiesServices: DummiesService) {
    // this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ArbolNode) => node.expandable;
}