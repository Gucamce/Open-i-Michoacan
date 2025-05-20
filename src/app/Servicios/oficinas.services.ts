import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";

const url = environment.apiurl;
const urlOficina = environment.officeurl;


@Injectable({ providedIn: 'root' })

export class OficinaServices {


    constructor(private http: HttpClient) {
        // Constructor logic here
    }

    // Example method
    arbolDocument(json: any): Observable<any> {
        // Implement your login logic here
        let token = localStorage.getItem("TK");
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
        })
        return this.http.post(`${url}/document/filter`, json, { headers }); // Placeholder return value

    }


    catalogos(json: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })
        return this.http.post(`${urlOficina}/RESTAdapter/catalogos`, json, { headers });
    }

}

