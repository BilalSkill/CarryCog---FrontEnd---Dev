import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  loadAPI: Promise<any>;
  title = 'CarryCog - Reset Password';
  constructor(private titleService: Title, private metaService: Meta,private router:Router, private route: ActivatedRoute,public service:UserService,private toastr:ToastrService) { 

  }
  userID;
  customUserID;
  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);
    //this.service.ResetPasswordModel.reset();
    this.userID = this.route.snapshot.paramMap.get('ID');
    if(this.userID != null){
    this.customUserID = this.userID.split('|');
    }
  }

  
  

  onSubmit() {
    var result = this.service.resetPassword(this.customUserID[1]);
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
          this.service.ResetPasswordModel.reset();
          this.service.verifyEmailObject = res;
          this.toastr.success('Password has been updated successfully', 'Password Updated');
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
