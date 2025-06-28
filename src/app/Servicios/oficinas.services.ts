import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";

const url = environment.apiurl;


@Injectable({ providedIn: 'root' })
export class OficinaServices {
    documentos: any[] = [];

    constructor(
        private http: HttpClient,
    ) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem("TK");
        return new HttpHeaders ({
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        });
    }

    arbolDocument(json: any): Observable<any> {
        return this.http.post(`${url}/document/filter`, json, { headers: this.getAuthHeaders() });
    }

    getBranches(): Observable<any> {
        return this.http.post(`${url}/document/branch`, {}, { headers: this.getAuthHeaders() })
    }

    getUsuarioById(id: string): Observable<any> {
        return this.http.post(`${url}/user/register`, { id }, { headers: this.getAuthHeaders() });
    }

    registroUsuario(UserData: any): Observable<any> {
        return this.http.post(`${url}/user/register`, UserData, {headers: this.getAuthHeaders()})
    }

    getUsuarios (): Observable<any> {
        return this.http.post(`${url}/document/users`, {}, {headers: this.getAuthHeaders()})
    }

    editarUsuario(UserData: any): Observable<any> {
        return this.http.post(`${url}/document/users`, UserData, {headers: this.getAuthHeaders()})
    }

    eliminarUsuario(id: string): Observable<any> {
        return this.http.delete(`${url}/document/users/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }

}

