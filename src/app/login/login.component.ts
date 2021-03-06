import { Component, OnInit } from '@angular/core';
import { UserService } from './../shared/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RefreshHeaderService } from '../shared/refresh-header.service';
import { Title, Meta } from '@angular/platform-browser';
import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel = {
    Email: '',
    Password: ''
  }
  loadAPI: Promise<any>;
  title = 'CarryCog - Login';
  user: SocialUser;
  constructor(private authService: SocialAuthService,private titleService: Title, private metaService: Meta,public service: UserService, private _headerService:RefreshHeaderService, private router: Router,private toaster:ToastrService) { 
  
  }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);

    if (localStorage.getItem('token') != null)
    this.router.navigateByUrl('/Home');
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe(      
      (res: any) => {
      this.user = res;
      if(this.user != null){
      this.service.loginSocialUsers(this.user).subscribe(
        (res: any) => {
           localStorage.setItem('userName',res.FirstName+' '+res.LastName);
           localStorage.setItem('userID',res.Id);
           localStorage.setItem('token', res.Token);
           this._headerService.onRefreshHeader();
           this.router.navigateByUrl('/Home');
         },
         err => {
           if (err.status == 400){
            this.toaster.error(err.error.message, 'Activation failed.');
            console.log(err.error.message);
           }
           else{
           this.toaster.error('Incorrect username or password.', 'Authentication failed.');
           console.log(err);
           }
         }     
       );
      }
    else{
      //this.toaster.error('Facebook session failed.', 'Facebook Session failed.');
    }},
    err => {
      console.log(err);
     // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
    );
  }
  onSubmit(form: NgForm) {
    this.service.login(form.value).subscribe(
     (res: any) => {
        localStorage.setItem('userName',res.FirstName+' '+res.LastName);
        localStorage.setItem('userID',res.Id);
        localStorage.setItem('token', res.Token);
        this._headerService.onRefreshHeader();
        this.router.navigateByUrl('/Home');
      },
      err => {
        if (err.status == 400){
         this.toaster.error(err.error.message, 'Activation failed.');
         console.log(err.error.message);
        }
        else{
        this.toaster.error('Incorrect username or password.', 'Authentication failed.');
        console.log(err);
        }
      }     
    );
  }
}
