import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../servicios/auth.service";
import {TokenStorageService} from "../../servicios/token-storage.service";
import {CommonService} from "../../servicios/common-service.service";

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent implements OnInit {
descripcion:String;
  isLoggedIn = false;
  messageReceived: any;
  private subscriptionName: Subscription; //important to create a subscription
  userDisplayName:string;
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private service: CommonService) {
    this.subscriptionName= this.service.getUpdate().subscribe
    (message => { //message contains the data sent from service
      this.messageReceived = message;
      console.log(this.messageReceived)
      if (this.messageReceived.text === "reload"){
        this.isLoggedIn=!this.isLoggedIn;

        setTimeout(() => {
          this.userDisplayName = window.sessionStorage.getItem('loggedUser');

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
  }

}
