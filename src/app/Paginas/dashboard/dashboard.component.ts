import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DummiesService } from '../../Servicios/dummies.services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OficinaServices } from '../../Servicios/oficinas.services';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';

interface TreeNode {
  name: string;
  link?: string;
  children?: TreeNode[];
  documentos?: { name: string, link: string, methodPay: string }[];

}

interface ArbolNode {
  expandable: boolean;
  name: string;
  level: number;
  link?: string;
  methodPay?: string;
  originalNode?: TreeNode;
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
    MatTableModule,
    ScrollingModule,
    CommonModule,
    NgxExtendedPdfViewerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  oficinaSeleccionada: any;
  pdfSrc: string = '';
  zoom = 1.0;

  documentosSeleccionados: any[] = [];
  dataSourceDocumentos = new MatTableDataSource<any>();

  treeControl = new FlatTreeControl<ArbolNode>(
    node => node.level,
    node => node.expandable,
  );

  private _transformer = (node: TreeNode, level: number): ArbolNode => ({
    name: node.name,
    level,
    link: node.link,
    expandable: !!node.children && node.children.length > 0,
    originalNode: node,
  });

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private dummiesServices: DummiesService, private oficinasSrv: OficinaServices) { }

  ngOnInit(): void {
    const officeStorage = localStorage.getItem("oficinaseleccion");
    this.oficinaSeleccionada = officeStorage ? JSON.parse(officeStorage) : null;
    this.cargarArbol();

    this.dataSourceDocumentos.filterPredicate = (data, filter) => {
      return data.column.toLowerCase().includes(filter);
    };
  }

  hasChild = (_: number, node: ArbolNode) => node.expandable;

  cargarArbol() {
    const payload = {
      name: null,
      type: null,
      methodPay: null,
      year: null,
      month: null,
      fullDate: null,
      branch: '011',
      typeFilter: 4
    };

    this.oficinasSrv.arbolDocument(payload).subscribe((resp: any) => {
      const estructuraJerarquica = this.transformarArbol(resp.listDocuments);
      this.dataSource.data = estructuraJerarquica;

    });
  }

  transformarArbol(documentos: any[]): TreeNode[] {

    const tree: TreeNode[] = [];

    for (const doc of documentos) {
      const { year, month, type, name, link, methodPay } = doc;

      //Nodo Año
      let nodoAnio = tree.find(n => n.name === year);
      if (!nodoAnio) {
        nodoAnio = { name: year, children: [] };
        tree.push(nodoAnio);
      }

      //Nodo Mes
      let nodoMes = nodoAnio.children!.find(n => n.name === month);
      if (!nodoMes) {
        nodoMes = { name: month, children: [] };
        nodoAnio.children!.push(nodoMes);
      }
      //Nodo Tipo (Documentos)
      let nodoTipo = nodoMes.children!.find(n => n.name === type);
      if (!nodoTipo) {
        nodoTipo = { name: type, children: [], documentos: [] as any[] };
        nodoMes.children!.push(nodoTipo);
      }
      //Guarda Documentos en el Nodo Tipo
      nodoTipo.documentos!.push({ name, link, methodPay });
    }

    return tree;

  }

  onNodeClick(node: ArbolNode) {
    const original = node.originalNode;

    console.log('Nodo clickeado:', node);
    console.log('Nivel:', node.level);
    console.log('Documentos en nodo:', original?.documentos);



    //Verifica si el nodo es un documento
    if (node.level === 2 && original?.documentos?.length) {

      this.documentosSeleccionados = original.documentos.map(doc => ({
        column: doc.name,
        link: doc.link,
        methodPay: doc.methodPay,
      }));
      this.dataSourceDocumentos.data = this.documentosSeleccionados;
    } else {
      this.documentosSeleccionados = [];
      this.dataSourceDocumentos.data = [];
      this.pdfSrc = '';
    }
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSourceDocumentos.filter = valorFiltro.trim().toLowerCase();
  }

  mostrarPDF(nombreDocumento: string) {
    const documento = this.documentosSeleccionados.find(doc => doc.column
      === nombreDocumento);
    if (documento) {
      console.log('link del documento seleccionado:',documento.link);
      console.log('Nombre del documento seleccionado:', nombreDocumento);
      console.log('methodPay del documento seleccionado:',documento.methodPay);
    
      
      this.pdfSrc = documento.link;
    }
  }

  encontrarNodoPorNombre(nodos: TreeNode[], nombre: string): TreeNode | null {
    for (const nodo of nodos) {
      if (nodo.name === nombre) return nodo;
      if (nodo.children) {
        const encontrado = this.encontrarNodoPorNombre(nodo.children, nombre);
        if (encontrado) return encontrado;
      }
    }
    return null;
  }

  getNombreMes(numero: string): string {
    const meses: any = {
      '01': 'Enero', '02': 'Febrero', '03': 'Marzo',
      '04': 'Abril', '05': 'Mayo', '06': 'Junio',
      '07': 'Julio', '08': 'Agosto', '09': 'Septiembre',
      '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };
    return meses[numero] || numero;
  }
  toggleNode(node: ArbolNode): void {
    this.treeControl.isExpanded(node)
      ? this.treeControl.collapse(node)
      : this.treeControl.expand(node);
  }
}