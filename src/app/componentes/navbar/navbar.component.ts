import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../servicios/common-service.service";
import {Subscription} from "rxjs";
import { TokenStorageService } from 'src/app/servicios/token-storage.service';
import {AuthService} from "../../servicios/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
isLoggedIn:boolean=false;

  messageReceived: any;
  private subscriptionName: Subscription;
  userDisplayName:string;

  constructor(private service: CommonService, private authService: AuthService, private tokenStorage: TokenStorageService) {

    this.subscriptionName= this.service.getUpdate().subscribe
    (message => { //message contains the data sent from service
      this.messageReceived = message;
      console.log(this.messageReceived)
      if (this.messageReceived.text === "reload"){

        setTimeout(() => {

          if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            // this.router.navigate(['']);

          }
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

  logear() {
    this.service.sendUpdate("log");
  }

  signOutEvent() {

    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.service.sendUpdate("reload");
    this.service.sendUpdate("log");
    this.isLoggedIn = !this.isLoggedIn;
    window.location.reload();
  }
}
