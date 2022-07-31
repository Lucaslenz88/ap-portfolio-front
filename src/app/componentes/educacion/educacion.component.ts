import { Component, OnInit } from '@angular/core';
import {Educacion} from "../../dominio/Educacion";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../servicios/auth.service";
import {TokenStorageService} from "../../servicios/token-storage.service";
import {CommonService} from "../../servicios/common-service.service";
import {ExperienciaService} from "../../servicios/experiencia.service";
import {EducacionService} from "../../servicios/educacion.service";

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  educacion:Educacion=new Educacion()
  educaciones:Array<Educacion>=[];
  agregarOK:boolean=false;

  editarOK:boolean=false;
  modVal:number;

  isLoggedIn = false;
  messageReceived: any;
  private subscriptionName: Subscription; //important to create a subscription
  userDisplayName:string;
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private service: CommonService,private edservice: EducacionService) {
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
    this.edservice.getAll()
      .subscribe(response => this.educaciones = response)
  }

  enviarForm(formularioTD: NgForm) {
    console.log(this.educacion)
    //limpiar imputs
    formularioTD.form.reset();
  }

  agregar() {
    this.agregarOK=!this.agregarOK;
  }
  enviar() {
    console.log(this.educacion)
    this.edservice
      .addEducacion(this.educacion)
      .subscribe(response => {
        console.log(response)
        this.edservice
          .getAll()
          .subscribe(response => this.educaciones = response);
      });
    this.agregarOK=!this.agregarOK;
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
    this.edservice.deleteById(this.modVal)
      .subscribe(response => console.log(response))
    window.location.reload();
  }

  editarForm(id: number) {
    this.educacion.id = this.modVal;
    this.edservice
      .updateEducacion(this.modVal, this.educacion)
      .subscribe(response => {
        console.log(response);
        // recorrer el array y modificar el objeto con ese id

        this.edservice
          .getAll()
          .subscribe(response => this.educaciones = response);

      });
    this.editarOK =! this.editarOK;
    window.location.reload();
  }
}
