import { Component, OnInit } from '@angular/core';
import {Experiencia} from "../../dominio/Experiencia";
import {Subscription} from "rxjs";
import {Habilidad} from "../../dominio/Habilidad";
import {AuthService} from "../../servicios/auth.service";
import {TokenStorageService} from "../../servicios/token-storage.service";
import {CommonService} from "../../servicios/common-service.service";
import {ExperienciaService} from "../../servicios/experiencia.service";
import {HabilidadesService} from "../../servicios/habilidades.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-habilidades',
  templateUrl: './habilidades.component.html',
  styleUrls: ['./habilidades.component.css']
})
export class HabilidadesComponent implements OnInit {
  habilidad:Habilidad=new Habilidad()
  habilidades:Array<Habilidad>=[];


  isLoggedIn = false;
  messageReceived: any;
  private subscriptionName: Subscription; //important to create a subscription
  userDisplayName:string;
  agregarOK:boolean=false;

  editarOK:boolean=false;
  modVal:number;
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private service: CommonService, private habservice: HabilidadesService) {
    this.subscriptionName= this.service.getUpdate().subscribe
    (message => { //message contains the data sent from service
      this.messageReceived = message;
      console.log(this.messageReceived)
      if (this.messageReceived.text === "reload"){
        if (this.tokenStorage.getToken()) {
          this.isLoggedIn = true; //para utilizar con ngIf en el html. Controla el
          //nombre de usuario en el encabezado y el menu
        }

        setTimeout(() => {
          this.userDisplayName = window.sessionStorage.getItem('loggedUser');
          window.location.reload();
        }, 1000);

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
    this.habservice.getAll()
      .subscribe(response => this.habilidades = response)
  }

  enviarForm(formularioTD: NgForm) {
    console.log(this.habilidad)
    //limpiar imputs
    formularioTD.form.reset();
  }

  agregar() {
    this.agregarOK=!this.agregarOK;
  }

  enviar() {
    console.log(this.habilidad)
    this.habservice
      .addHabilidad(this.habilidad)
      .subscribe(response => {
        console.log(response)
        this.habservice
          .getAll()
          .subscribe(response => this.habilidades = response);
      });
    this.agregarOK=!this.agregarOK;
    window.location.reload();
  }

  editar() {
    this.editarOK =! this.editarOK;

  }

  eliminar() {
    this.habservice.deleteById(this.modVal)
      .subscribe(response => console.log(response))
    window.location.reload();

  }

  editarForm(id:number) {
    this.habilidad.id = this.modVal;
    this.habservice
      .updateHabilidad(this.modVal, this.habilidad)
      .subscribe(response => {
        console.log(response);
        // recorrer el array y modificar el objeto con ese id

        this.habservice
          .getAll()
          .subscribe(response => this.habilidades = response);

      });
    this.editarOK =! this.editarOK;
    window.location.reload();
  }

  changeModVal(id: number) {
    this.modVal = id;
    console.log(this.modVal)
  }


}
