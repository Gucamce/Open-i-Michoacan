import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";

const url= environment.officeurl;

@Injectable({providedIn: 'root'})

export class OfficeService {
  constructor(private http: HttpClient) {
    // Constructor logic here
  }

}