import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Experiencia} from "../dominio/Experiencia";
import {Proyecto} from "../dominio/Proyecto";

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' }

    )};
  constructor(private http: HttpClient) { }

  getAll():Observable<Array<Proyecto>> {
    return this.http
      .get<Array<Proyecto>>("https://ll-portfolio-ap-api.herokuapp.com/response/proyectos")
      .pipe(
        catchError(this.handleExeption)
      );//después es lo mismo para los otros
  }

  deleteById(id:number) {
    return this.http
      .delete("https://ll-portfolio-ap-api.herokuapp.com/delete/dlPro/"+id
        ,this.httpOptions
      );
  }

  addProyecto(proyecto: Proyecto){
    return this.http
      .post("https://ll-portfolio-ap-api.herokuapp.com/response/proyecto",
        proyecto,
        this.getHttpOptions())
  }

  updateProyecto(id:number, proyecto:Proyecto){
    return this.http
      .put("https://ll-portfolio-ap-api.herokuapp.com/response/proyectoUpdate", proyecto, this.getHttpOptions());
  }




  handleExeption(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent){
      console.log('Error http front ' + error.error.message)
    } else {
      console.log('Error http back ' + error.error.message() + ' ' +error.error.status)
    }
    return throwError('Error de comunicación');
  }

  private getHttpOptions() {//lo pide así el método post
    return {
      headers: new HttpHeaders({
        'content-type':'application/json'
      })
    }
  }
}
