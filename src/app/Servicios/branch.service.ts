import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const branchUrl = environment.apiurl;

@Injectable({
  providedIn: 'root'
})
export class BranchService {


  constructor(private http: HttpClient) { }

  getBranches(type: any): Observable <any[]> {
    const body = {
      description: null,
      office: null,
      type: type,
    };

    return this.http.post<any[]>(`${branchUrl}/document/branch`,body);
  
  }
}
