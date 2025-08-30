import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const url = environment.apiurl;


@Injectable({ providedIn: 'root' })

export class LoginService {


    constructor(private http: HttpClient) {
        // Constructor logic here
    }

    // Example method
    login(userName: any, password: string): Observable<any> {
        // Implement your login logic here

        let json = {
            userName: userName, password: password
        };
        return this.http.post(`${url}/user/login`, json); // Placeholder return value
    }
}

