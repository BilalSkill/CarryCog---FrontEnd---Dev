import { Component, OnInit } from '@angular/core';
import { UserService } from './../shared/user.service';
import { Router } from '@angular/router';
import { ToastRef, ToastrService } from 'ngx-toastr';
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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  loadAPI: Promise<any>;
  title = 'CarryCog - SignUp';
  user: SocialUser;
  constructor(private authService: SocialAuthService,private titleService: Title, private metaService: Meta,public service: UserService,private router:Router,private toastr:ToastrService,private _headerService:RefreshHeaderService) { 

  }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);

    this.service.formModel.reset();
  }
  
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe(user => {
      this.user = user;
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
            this.toastr.error(err.error.message, 'Activation failed.');
            console.log(err.error.message);
           }
           else{
           this.toastr.error('Incorrect username or password.', 'Authentication failed.');
           console.log(err);
           }
         }     
       );}
       else{
         
       }
    });
  }

  onSubmit() {
    var result =this.service.register();
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('Activation code has been sent to your email. Please activate your account.', 'Registration successful');
          this._headerService.onRefreshHeader();
          this.router.navigateByUrl("/login");
        } else {
          console.log(res.errors);
          this.toastr.error(res.errors, 'Error');
        }
      },
      err => {       
        this.toastr.error(err.error.errors, 'Error');
      }
    );
  }

}

