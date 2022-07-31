import { Component, OnInit } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgForm} from "@angular/forms";
import {Experiencia} from "../../dominio/Experiencia";
import {Subscription} from "rxjs";
import {TokenStorageService} from "../../servicios/token-storage.service";
import {AuthService} from "../../servicios/auth.service";
import {CommonService} from "../../servicios/common-service.service";
import {ExperienciaService} from "../../servicios/experiencia.service";

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  experiencia:Experiencia=new Experiencia()
  experiencias:Array<Experiencia>=[];


  isLoggedIn = false;
  messageReceived: any;
  private subscriptionName: Subscription; //important to create a subscription
  userDisplayName:string;
  agregarOK:boolean=false;

  editarOK:boolean=false;
  modVal:number;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private service: CommonService, private expservice: ExperienciaService) {
    this.subscriptionName= this.service.getUpdate().subscribe
    (message => { //message contains the data sent from service
      this.messageReceived = message;
      console.log(this.messageReceived)
      if (this.messageReceived.text === "reload"){
        if (this.tokenStorage.getToken()) {
          this.isLoggedIn = true; //para utilizar con ngIf en el html. Controla el
          //nombre de usuario en el encabezado y el menu
        }

        // setTimeout(() => {
        //   this.userDisplayName = window.sessionStorage.getItem('loggedUser');
        //   window.location.reload();
        // }, 1000);


      }
    });
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true; //para utilizar con ngIf en el html. Controla el
      //nombre de usuario en el encabezado y el menu


    }
    this.expservice.getAll()
      .subscribe(response => this.experiencias = response)
  }

  enviarForm(formularioTD: NgForm) {
    console.log(this.experiencia)
    //limpiar imputs
    formularioTD.form.reset();
  }

  agregar() {
    this.agregarOK=!this.agregarOK;
  }

  enviar() {
    console.log(this.experiencia)
    this.expservice
      .addExperiencia(this.experiencia)
      .subscribe(response => {
        console.log(response)
        this.expservice
          .getAll()
          .subscribe(response => this.experiencias = response);
      });
    this.agregarOK=!this.agregarOK;
    window.location.reload();
  }

  editar() {
    this.editarOK =! this.editarOK;
  }

  eliminar() {
    this.expservice.deleteById(this.modVal)
      .subscribe(response => console.log(response))
    window.location.reload();

  }

  editarForm(id:number) {
    this.experiencia.id = this.modVal;
    this.expservice
      .updateExperiencia(this.modVal, this.experiencia)
      .subscribe(response => {
        console.log(response);
        // recorrer el array y modificar el objeto con ese id

        this.expservice
          .getAll()
          .subscribe(response => this.experiencias = response);

      });
    this.editarOK =! this.editarOK;
    window.location.reload();
  }

  changeModVal(id: number) {
    this.modVal = id;
   console.log(this.modVal)
  }



}
