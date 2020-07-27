import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent implements OnInit {
  title = 'CarryCog - Verify Email';
  loadAPI: Promise<any>;
  constructor(private titleService: Title, private metaService: Meta,private router:Router,public service:UserService,private toastr:ToastrService) { 

  }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);

    this.service.emailModel.reset();
  }

 
  onSubmit() {
    var result =this.service.verifyEmail();
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
         // this.service.emailModel.reset();
         // this.service.verifyEmailObject = res;
          this.toastr.success('Reset password link has been sent to your Email.', 'Email Verified');
          //this.router.navigateByUrl("/resetpassword");
        } else {
          console.log(res.errors);
          this.toastr.error(res.errors, 'Email Not Found!');
        }
      },
      err => {       
        this.toastr.error(err.error.errors, 'Error');
      }
    );
  }

}
