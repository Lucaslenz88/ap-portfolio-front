import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Experiencia} from "../dominio/Experiencia";
import {Educacion} from "../dominio/Educacion";

@Injectable({
  providedIn: 'root'
})
export class EducacionService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' }

    )};


  constructor(private http: HttpClient) { }

  getAll():Observable<Array<Educacion>> {
    return this.http
      .get<Array<Educacion>>("https://ll-portfolio-ap-api.herokuapp.com/response/educaciones")
      .pipe(
        catchError(this.handleExeption)
      );//después es lo mismo para los otros
  }

  deleteById(id:number) {
    return this.http
      .delete("https://ll-portfolio-ap-api.herokuapp.com/delete/dlEd/"+id
        ,this.httpOptions
      );
  }

  addEducacion(educacion: Educacion){
    return this.http
      .post("https://ll-portfolio-ap-api.herokuapp.com/response/educacion",
        educacion,
        this.getHttpOptions())
  }

  updateEducacion(id:number, educacion:Educacion){
    return this.http
      .put("https://ll-portfolio-ap-api.herokuapp.com/response/educacionUpdate", educacion, this.getHttpOptions());
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
