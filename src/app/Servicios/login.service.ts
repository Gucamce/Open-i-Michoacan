import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";

const url = environment.apiurl;


@Injectable({ providedIn: 'root' })

export class LoginService {


    constructor(private http: HttpClient) {
        // Constructor logic here
    }

    // Listado de Oficinas Completo
    obtenerOficinas(): Observable<any> {
        return this.http.get<any>('http://gemnwpiq.michoacan.gob.mx:51000');
    }

    // Example method
    login(userName: any, password: string): Observable<any> {
        // Implement your login logic here
        debugger
        let json = {
            userName: userName, password: password
        };
        return this.http.post(`${url}/user/login`, json); // Placeholder return value
    }
}

