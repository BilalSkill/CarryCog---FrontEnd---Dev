import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';

import { ToastRef, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activateuser',
  templateUrl: './activateuser.component.html',
  styleUrls: ['./activateuser.component.css']
})
export class ActivateuserComponent implements OnInit {

  constructor(private _userService:UserService, private route: ActivatedRoute,private router:Router,private toastr:ToastrService) { }
  Email;
  ngOnInit(): void {
    this.Email = this.route.snapshot.paramMap.get('Email');
    var result =this._userService.activateUser(this.Email);
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
          this.toastr.success('Account has been activated.', 'Email verified');
          
          this.router.navigateByUrl("/Home");
        } else {
          this.toastr.error(res.errors, 'Error');
        }
      },
      err => {       
        this.toastr.error(err.error.errors, 'Error');
      }
    );
  }

}
