import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Experiencia} from "../dominio/Experiencia";
import {Habilidad} from "../dominio/Habilidad";

@Injectable({
  providedIn: 'root'
})
export class HabilidadesService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' }

    )};
  constructor(private http: HttpClient) { }

  getAll():Observable<Array<Habilidad>> {
    return this.http
      .get<Array<Habilidad>>("https://ll-portfolio-ap-api.herokuapp.com/response/habilidades")
      .pipe(
        catchError(this.handleExeption)
      );//después es lo mismo para los otros
  }


  deleteById(id:number) {
    return this.http
      .delete("https://ll-portfolio-ap-api.herokuapp.com/delete/dlHab/"+id
        ,this.httpOptions
      );
  }

  addHabilidad(habilidad: Habilidad){
    return this.http
      .post("https://ll-portfolio-ap-api.herokuapp.com/response/habilidades",
        habilidad,
        this.getHttpOptions())
  }

  updateHabilidad(id:number, habilidad:Habilidad){
    return this.http
      .put("https://ll-portfolio-ap-api.herokuapp.com/response/habilidadUpdate", habilidad, this.getHttpOptions());
  }

  private getHttpOptions() {//lo pide así el método post
    return {
      headers: new HttpHeaders({
        'content-type':'application/json'
      })
    }
  }

  handleExeption(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent){
      console.log('Error http front ' + error.error.message)
    } else {
      console.log('Error http back ' + error.error.message() + ' ' +error.error.status)
    }
    return throwError('Error de comunicación');
  }
}
