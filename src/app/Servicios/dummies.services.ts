import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DummiesService {
  constructor() { }

  catBusquedaAgente(): Observable <any[]> {
    let catBusqueda = [
        {
            id: 1, descripcion: "Ingreso",
            anio: [
                {
                    descripcion: "2025", id: 1,
                    mes: [
                        { descripcion: "Enero", idmes: 1 },
                        { descripcion: "Febrero", idmes: 2 },
                        { descripcion: "Marzo", idmes: 3 },
                        { descripcion: "Abril", idmes: 4 },
                        { descripcion: "Mayo", idmes: 5 },
                        { descripcion: "Junio", idmes: 6 },
                        { descripcion: "Julio", idmes: 7 },
                        { descripcion: "Agosto", idmes: 8 },
                        { descripcion: "Septiembre", idmes: 9 },
                        { descripcion: "Octubre", idmes: 10 },
                        { descripcion: "Noviembre", idmes: 11 },
                        { descripcion: "Diciembre", idmes: 12 }
                    ]
                },
                { descripcion: "2024", id: 2, mes: [] }
            ]
        },
        {
            id: 2, descripcion: "Anulaciones",
            anio: [
                {
                    descripcion: "2025", id: 1,
                    mes: [
                        { descripcion: "Enero", idmes: 1 },
                        { descripcion: "Febrero", idmes: 2 },
                        { descripcion: "Marzo", idmes: 3 },
                        { descripcion: "Abril", idmes: 4 },
                        { descripcion: "Mayo", idmes: 5 },
                        { descripcion: "Junio", idmes: 6 },
                        { descripcion: "Julio", idmes: 7 },
                        { descripcion: "Agosto", idmes: 8 },
                        { descripcion: "Septiembre", idmes: 9 },
                        { descripcion: "Octubre", idmes: 10 },
                        { descripcion: "Noviembre", idmes: 11 },
                        { descripcion: "Diciembre", idmes: 12 }
                    ]
                },
                { descripcion: "2024", id: 2, mes: [] }
            ]
        },
        {
            id: 3, descripcion: "Salidas",
            anio: [
                {
                    descripcion: "2025", id: 1,
                    mes: [
                        { descripcion: "Enero", idmes: 1 },
                        { descripcion: "Febrero", idmes: 2 },
                        { descripcion: "Marzo", idmes: 3 },
                        { descripcion: "Abril", idmes: 4 },
                        { descripcion: "Mayo", idmes: 5 },
                        { descripcion: "Junio", idmes: 6 },
                        { descripcion: "Julio", idmes: 7 },
                        { descripcion: "Agosto", idmes: 8 },
                        { descripcion: "Septiembre", idmes: 9 },
                        { descripcion: "Octubre", idmes: 10 },
                        { descripcion: "Noviembre", idmes: 11 },
                        { descripcion: "Diciembre", idmes: 12 }
                    ]
                },
                { descripcion: "2024", id: 2, mes: [] }
            ]
        },
        {
            id: 4, descripcion: "Cierre de Cajas",
            anio: [
                {
                    descripcion: "2025", id: 1,
                    mes: [
                        { descripcion: "Enero", idmes: 1 },
                        { descripcion: "Febrero", idmes: 2 },
                        { descripcion: "Marzo", idmes: 3 },
                        { descripcion: "Abril", idmes: 4 },
                        { descripcion: "Mayo", idmes: 5 },
                        { descripcion: "Junio", idmes: 6 },
                        { descripcion: "Julio", idmes: 7 },
                        { descripcion: "Agosto", idmes: 8 },
                        { descripcion: "Septiembre", idmes: 9 },
                        { descripcion: "Octubre", idmes: 10 },
                        { descripcion: "Noviembre", idmes: 11 },
                        { descripcion: "Diciembre", idmes: 12 }
                    ]
                },
                { descripcion: "2024", id: 2, mes: [] }
            ]
        },
        {
            id: 2, descripcion: "Poliza",
            anio: [
                {
                    descripcion: "2025", id: 1,
                    mes: [
                        { descripcion: "Enero", idmes: 1 },
                        { descripcion: "Febrero", idmes: 2 },
                        { descripcion: "Marzo", idmes: 3 },
                        { descripcion: "Abril", idmes: 4 },
                        { descripcion: "Mayo", idmes: 5 },
                        { descripcion: "Junio", idmes: 6 },
                        { descripcion: "Julio", idmes: 7 },
                        { descripcion: "Agosto", idmes: 8 },
                        { descripcion: "Septiembre", idmes: 9 },
                        { descripcion: "Octubre", idmes: 10 },
                        { descripcion: "Noviembre", idmes: 11 },
                        { descripcion: "Diciembre", idmes: 12 }
                    ]
                },
                { descripcion: "2024", id: 2, mes: [] }
            ]
        },
        
    ];
    return of (catBusqueda);
  }
//   getUsers(): UserData[] {
//     return Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
//   }
}