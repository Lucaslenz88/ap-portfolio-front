import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../servicios/auth.service";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../servicios/token-storage.service";
import {CommonService} from "../../servicios/common-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null  //datos que se envían por formulario
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  id:string='';
  log:boolean=false;
  private subscriptionName: Subscription; //important to create a subscription
  private messageReceived: any;
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService
              ,private service: CommonService) {
    this.subscriptionName= this.service.getUpdate().subscribe
    (message => { //message contains the data sent from service
      this.messageReceived = message;
      console.log(this.messageReceived)
      if (this.messageReceived.text === "log"){
        console.log(this.log = !this.log);
      }
      // if (this.messageReceived.text === "reload"){
      //   this.isLoggedIn=!this.isLoggedIn;
      // }
    });
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
     this.service.sendUpdate("reload");
  }
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      // this.router.navigate(['']);

    }
  }

  enviarForm(formularioTD: NgForm) {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        window.sessionStorage.setItem('loggedUser', username);
        this.id = window.sessionStorage.getItem('loggedUser');
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // setTimeout(() => {
        //   this.router.navigate(['/transacciones/'+this.id
        //   ]);
        // }, 1000);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });

    formularioTD.form.reset();
  }

}
