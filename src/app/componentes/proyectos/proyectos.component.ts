import { Component, OnInit } from '@angular/core';
import {Proyecto} from "../../dominio/Proyecto";
import {Educacion} from "../../dominio/Educacion";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../servicios/auth.service";
import {TokenStorageService} from "../../servicios/token-storage.service";
import {CommonService} from "../../servicios/common-service.service";
import {ProyectoService} from "../../servicios/proyecto.service";
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyecto:Proyecto=new Proyecto()
  proyectos:Array<Proyecto>=[];

  isLoggedIn = false;
  messageReceived: any;
  private subscriptionName: Subscription; //important to create a subscription
  userDisplayName:string;

  agregarOK:boolean=false;
  editarOK:boolean=false;
  modVal:number;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private service: CommonService, private proservice: ProyectoService) {
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
    this.proservice.getAll()
      .subscribe(response => this.proyectos = response)
  }

  enviarForm(formularioTD: NgForm) {
    console.log(this.proyecto)
    //limpiar imputs
    formularioTD.form.reset();
  }

  agregar() {
    this.agregarOK=!this.agregarOK;
  }
  enviar() {

    console.log(this.proyecto)
    this.proservice
      .addProyecto(this.proyecto)
      .subscribe(response => {
        console.log(response)

      });
    this.agregarOK=!this.agregarOK;

      this.proservice
        .getAll()
        .subscribe(response => this.proyectos = response);
    window.location.reload();

  }

  editar() {
    this.editarOK =! this.editarOK;
  }

  changeModVal(id:number) {
    this.modVal = id;
    console.log(this.modVal)
  }

  eliminar() {
    this.proservice.deleteById(this.modVal)
      .subscribe(response => console.log(response))
    window.location.reload();
  }

  editarForm(id: number) {
    this.proyecto.id = this.modVal;
    this.proservice
      .updateProyecto(this.modVal, this.proyecto)
      .subscribe(response => {
        console.log(response);
        // recorrer el array y modificar el objeto con ese id

        this.proservice
          .getAll()
          .subscribe(response => this.proyectos = response);

      });
    this.editarOK =! this.editarOK;
    window.location.reload();
  }
}
