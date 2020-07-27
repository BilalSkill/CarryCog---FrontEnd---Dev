import { Component, OnInit } from '@angular/core';
import { UserService } from './../shared/user.service';
import { Router } from '@angular/router';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { RefreshHeaderService } from '../shared/refresh-header.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  loadAPI: Promise<any>;
  title = 'CarryCog - SignUp';
  constructor(private titleService: Title, private metaService: Meta,public service: UserService,private router:Router,private toastr:ToastrService,private _headerService:RefreshHeaderService) { 

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

