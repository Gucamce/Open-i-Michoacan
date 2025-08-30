import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OficinaServices } from '../../Servicios/oficinas.services';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewChild, TemplateRef } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface TreeNode {
  name: string;
  link?: string;
  children?: TreeNode[];
  documentos?: {
    name: string,
    link: string,
    methodPay: string,
    station: string,
    fullDate: string
  }[];
  id?: string;
}

interface ArbolNode {
  expandable: boolean;
  name: string;
  level: number;
  link?: string;
  methodPay?: string;
  station?: string;
  originalNode?: TreeNode;
  id?: string; // ¡Añadimos esta propiedad para un ID único!
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
    MatCheckboxModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ScrollingModule,
    CommonModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent implements OnInit {

  isDownloading: boolean = false;
  oficinaSeleccionada: any;
  pdfSrc: string = '';
  zoom = 1.0;
  filaSeleccionada: any = null;

  @ViewChild('modalVisorPDF') modalVisorPDF!: TemplateRef<any>;

  documentosSeleccionados: Set<string> = new Set(); // IDs o nombres de documentos seleccionados

  dataSourceDocumentos = new MatTableDataSource<any>();
  documentoActual: any = null;

  filtroTexto: string = '';
  filtroFecha: string = '';
  filtroCaja: string = '';

  selectedTreeNodeId: string | null = null;
  displayedColumns: string[] = ['column', 'methodPay', 'station', 'ver', 'fullDate'];

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
    id: node.id,
  });

  private obtenerNombreDesdeLink(link: string): string {
    try {
      const url = new URL(link);
      return url.pathname.split('/').pop() || 'documento.pdf';
    } catch {
      return link.split('/').pop() || 'documento.pdf';
    }
  }

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // *** AÑADIR ESTA PROPIEDAD SI NO LA TIENES YA ***
  selectedTreeNode: ArbolNode | null = null; // Para guardar el nodo de árbol seleccionado

  constructor(
    private oficinasSrv: OficinaServices,
    private dialog: MatDialog
  ) { }
  

  ngOnInit(): void {
    const stored = localStorage.getItem("BRANCHES");

    if (stored) {
      this.oficinaSeleccionada = JSON.parse(stored);

      const branchId =
        this.oficinaSeleccionada?.office;

      console.log("Branch seleccionado desde oficina:", branchId);
    } else {
      console.warn("No hay oficna seleccionada en localStorage");
    }

    this.cargarArbol();

    this.dataSourceDocumentos.filterPredicate = (data, rawFilter) => {
      const filtro: { texto: string; fecha: string; caja: string } = JSON.parse(rawFilter);

      const search = filtro.texto.toLowerCase();
      const fecha = filtro.fecha.toLowerCase();
      const caja = filtro.caja.toLowerCase();

      const coincideTexto =
        data.column?.toLowerCase().includes(search) ||
        data.methodPay?.toLowerCase().includes(search);

      const coincideCaja =
        data.station?.toLowerCase().includes(caja);

      const coincideFecha = data.fullDate?.toLowerCase().includes(fecha)

      return coincideTexto && coincideFecha && coincideCaja;
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
      branch: this.oficinaSeleccionada?.office || '',
      station: null,
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
      const { year, month, type, name, link, methodPay, station, fullDate } = doc;

      const formattedType = this.tipoDocumentoMap[type] || this.formatName(type);

      // Nivel 0: Año
      let nodoAnio = tree.find(n => n.name === year);
      if (!nodoAnio) {
        nodoAnio = { name: year, children: [] };
        tree.push(nodoAnio);
      }

      // Nivel 1: Mes
      let nodoMes = nodoAnio.children!.find(n => n.name === month);
      if (!nodoMes) {
        nodoMes = { name: month, children: [] };
        nodoAnio.children!.push(nodoMes);
      }

      // Nivel 2: Tipo (formateado)
      let nodoTipo = nodoMes.children!.find(n => n.name === formattedType);
      if (!nodoTipo) {
        const tipoId = `${year}-${month}-${formattedType}`;
        nodoTipo = { name: formattedType, children: [], documentos: [], id: tipoId };
        nodoMes.children!.push(nodoTipo);
      }

      nodoTipo.documentos!.push({ name, link, methodPay, station, fullDate });
    }

    //Ordena los meses
    for (const nodoAnio of tree) {
      {
        nodoAnio.children = (nodoAnio.children || []).sort((a, b) => {
          const idxA = this.mesesOrden.indexOf(a.name);
          const idxB = this.mesesOrden.indexOf(b.name);
          return idxA - idxB;
        });
      };
    }

    // Ordena los nodos nivel 2 según nivel2Orden
    for (const nodoAnio of tree) {
      for (const nodoMes of nodoAnio.children || []) {
        nodoMes.children = (nodoMes.children || []).sort((a, b) => {
          const idxA = this.nivel2Orden.indexOf(a.name);
          const idxB = this.nivel2Orden.indexOf(b.name);
          return (idxA === -1? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        });
      }
    }

    return tree;
  }


  onNodeClick(node: ArbolNode) {
    const original = node.originalNode;

    console.log('Nodo clickeado:', node);
    console.log('Nivel:', node.level);
    console.log('Nodo ID:', node.id);
    console.log('Selected Node ID (component state):', this.selectedTreeNodeId);
    console.log('Documentos en nodo:', original?.documentos);

    // Si el nodo clicado es de nivel 2 (la "última carpeta" con documentos)
    if (node.level === 2 && node.id) {
      // Almacena el ID del nodo seleccionado
      this.selectedTreeNodeId = node.id; // Usa el ID para el foco

      // Carga los documentos asociados a este nodo de nivel 2
      if (original?.documentos?.length) {
        const documentos = original.documentos.map(doc => ({
          column: doc.name,
          link: doc.link,
          methodPay: doc.methodPay,
          fullDate: doc.fullDate,
          station: doc.station,
          seleccionado: false

        }));
        this.dataSourceDocumentos.data = documentos;
        this.actualizarColumnasVisibles();
        this.documentosSeleccionados.clear(); // Limpiar selección al cargar nuevos
      } else {
        // Si es nivel 2 pero no tiene documentos (quizás una carpeta vacía)
        this.dataSourceDocumentos.data = [];
        this.pdfSrc = '';
      }
    } else {
      // Si se hace clic en un nivel superior (año, mes), deselecciona la "última carpeta"
      this.selectedTreeNodeId = null; // Quita el foco
      this.dataSourceDocumentos.data = []; // También limpia la tabla de documentos
      this.pdfSrc = '';
    }


  }
  treeNodeTrackBy = (index: number, node: ArbolNode) => node.id;

  aplicarFiltro(event: Event) {
    this.filtroTexto = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.dataSourceDocumentos.filter = JSON.stringify({
      texto: this.filtroTexto.trim(),
      fecha: this.filtroFecha.trim(),
      caja: this.filtroCaja.trim(),
    });
  }

  filtrarPorFecha(event: Event) {
    this.filtroFecha = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }
  filtrarPorCaja(event: Event) {
    this.filtroCaja = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }

  mostrarPDF(documento: any) {
    if (documento?.link) {
      this.pdfSrc = documento.link;
      this.documentoActual = documento;

      this.dialog.open(this.modalVisorPDF, {
        width: '50vw',
        height: '70vh',
        maxWidth: '100vw',
        panelClass: 'full-screen-modal'
      });
    } else {
      console.warn('El documento no tiene un link válido');
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
  mesesOrden = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  getNombreMes(numero: string): string {
    const meses: any = {
      '01': 'Enero', '02': 'Febrero', '03': 'Marzo',
      '04': 'Abril', '05': 'Mayo', '06': 'Junio',
      '07': 'Julio', '08': 'Agosto', '09': 'Septiembre',
      '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };
    return meses[numero] || numero;
  }

  nivel2Orden = [
    'Ingresos',
    'Anulacion',
    'Contabilización de Salidas',
    'Cierre de Caja',
    'Póliza de Diario'
  ];

  tipoDocumentoMap: { [clave: string]: string } = {
    'Ingreso': 'Ingresos',
    'Anulacion': 'Anulacion',
    'Contabilización de salidas': 'Contabilización de Salidas',
    'Cierre de Caja': 'Cierre de Caja',
    'Poliza de Diario': 'Póliza de Diario',
  };

  formatName(name: string): string {
    const lowercaseWords = ['de', 'del', 'la', 'el', 'en', 'y', 'a', 'por', 'con', 'para', 'sin', 'al', 'o'];


    return name
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !lowercaseWords.includes(word)) {
          // Primera palabra o no está en la lista: capitaliza
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          // Palabra común en español: minúscula
          return word;
        }
      })
      .join(' ');
  }

  columnaBase: string[] = ['seleccion', 'column', 'methodPay', 'station', 'fullDate', 'ver']; //Falta 'seleccion' al inicio.
  columnaVisible: string [] = [];

  actualizarColumnasVisibles() {
    const data = this.dataSourceDocumentos.data;

    this.columnaVisible = this.columnaBase.filter(col => {
      if (col === 'seleccion' || col === 'ver' || col === 'column' || col === 'fullDate') return true; // Columnas Siempre Visibles

      return data.some(doc => !!doc[col]);
    })
  }

  toggleNode(node: ArbolNode): void {
    this.treeControl.isExpanded(node)
      ? this.treeControl.collapse(node)
      : this.treeControl.expand(node);
  }

  seleccionarDocumento(documento: any) {
    documento.seleccionado = !documento.seleccionado;
    if (documento.seleccionado) {
      this.documentosSeleccionados.add(documento.column);
    } else {
      this.documentosSeleccionados.delete(documento.column);
    }
  }

  estaSeleccionado(documento: any): boolean {
    return documento.seleccionado;
  }

  descargarPDFsSeleccionados() {
    const seleccionados = this.dataSourceDocumentos.data.filter(doc => doc.seleccionado);
    if (seleccionados.length === 0) {
      alert("No hay documentos seleccionados");
      return;
    }

    seleccionados.forEach(doc => {
      fetch(doc.link)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al descargar ${doc.column}`);
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.obtenerNombreDesdeLink(doc.link);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error al descargar:', error));
    });
  }

  async descargarDocumentosSeleccionados() {
    const zip = new JSZip();
    this.isDownloading = true; //Spiner para creacion de .ZIP

    let documentosSeleccionados = this.dataSourceDocumentos.data.filter(doc => doc.seleccionado);

    if (documentosSeleccionados.length > 10){
      documentosSeleccionados = documentosSeleccionados.slice(0, 10);
      alert ("Se descargaran solo los primeros 10 documentos.");
    }
      try {
        const oficina = this.oficinaSeleccionada?.office || 'Oficina';
        const descripcionOficina = this.oficinaSeleccionada?.description || 'Descripcion';
        
        const tareas = documentosSeleccionados.map(async (doc) => {
          try {
            const response = await fetch(doc.link);
            const blob = await response.blob();
            const nombreArchivo = `${doc.column || 'documento'}`; // Obtener nombre real
            zip.file(nombreArchivo, blob);
          
          } catch (error) {
            console.error(`Error al descargar el archivo: ${doc.nombreArchivo}`, error);
          }
        });
        //Espera a que descarguen todos los archivos
        await Promise.all(tareas);
        //Genera el ZIP
        const nombreZip = `${oficina}-${descripcionOficina}.zip`;
        const zipBlob = await zip.generateAsync({ type: 'blob'});
        
        saveAs(zipBlob, nombreZip);
      } catch (error) {
        console.error('Error generando ZIP:', error);
      } finally { 
        this.isDownloading = false; // En caso de error también parar spinner
      }
    }

  descargarPDF() {
    if (!this.pdfSrc || !this.documentoActual) {
      console.warn('No hay documento seleccionado para descargar');
      return;
    }
    fetch(this.pdfSrc)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo descargar el archivo');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.documentoActual.column || 'documento.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar el PDF', error);
      });
  }

  seleccionActiva: boolean = false; // Modo selección activado o no
  todosSeleccionados = false; // Estado global de selección

  toggleSeleccionarTodos() {
    this.todosSeleccionados = !this.todosSeleccionados;

    this.documentosSeleccionados.clear();

    this.dataSourceDocumentos.filteredData.forEach(doc => {
      doc.seleccionado = this.todosSeleccionados;

      if (this.documentosSeleccionados){
        this.documentosSeleccionados.add(doc.column);
      }
    });
  }
  get hayDocumentosSeleccionados(): boolean {
    return this.dataSourceDocumentos.data.some(doc => doc.seleccionado);
  }

  toggleSeleccion() {
    this.seleccionActiva = !this.seleccionActiva;
    if (!this.seleccionActiva) {
      this.documentosSeleccionados.clear(); // Limpiar selección al salir del modo
    }
  }

  toggleDocumentoSeleccionado(nombreDoc: string) {
    if (this.documentosSeleccionados.has(nombreDoc)) {
      this.documentosSeleccionados.delete(nombreDoc);
    } else {
      this.documentosSeleccionados.add(nombreDoc);
    }
  }

  seleccionarFila(row:any): void {
    this.filaSeleccionada = row;
  }
}