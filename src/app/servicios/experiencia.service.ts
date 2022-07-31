import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {Experiencia} from "../dominio/Experiencia";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ExperienciaService {

   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' }

    )};

  constructor(private http: HttpClient) { }

  getAll():Observable<Array<Experiencia>> {
    return this.http
      .get<Array<Experiencia>>("https://ll-portfolio-ap-api.herokuapp.com/response/experiencias")
      .pipe(
        catchError(this.handleExeption)
      );//después es lo mismo para los otros
  }


  deleteById(id:number) {
    return this.http
      .delete("https://ll-portfolio-ap-api.herokuapp.com/delete/dlExp/"+id
        ,this.httpOptions
        );
  }

  addExperiencia(experiencia: Experiencia){
    return this.http
      .post("https://ll-portfolio-ap-api.herokuapp.com/response/experiencia",
        experiencia,
        this.getHttpOptions())
  }

  updateExperiencia(id:number, experiencia:Experiencia){
    return this.http
      .put("https://ll-portfolio-ap-api.herokuapp.com/response/experienciaUpdate", experiencia, this.getHttpOptions());
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
