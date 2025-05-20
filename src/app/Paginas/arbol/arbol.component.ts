import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { DummiesService } from '../../Servicios/dummies.services';
import { OficinaServices } from '../../Servicios/oficinas.services';


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
  selector: 'app-arbol',
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './arbol.component.html',
  styleUrl: './arbol.component.css'
})

export class ArbolComponent implements OnInit {
  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };
  
  constructor(private dummiesServices: DummiesService, private oficinasSrv: OficinaServices) {

  }

  ngOnInit(): void {
    debugger
    let JSON = {
      "name": null,
      "type": null,
      "methodPay": null,
      "year": null,
      "month": null,
        "fullDate": null,
      "branch": "011",
        "typeFilter": 4
    }

    this.oficinasSrv.arbolDocument(JSON).subscribe (resp =>{

      console.log(resp);
      
    })

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


  hasChild = (_: number, node: ArbolNode) => node.expandable;
}