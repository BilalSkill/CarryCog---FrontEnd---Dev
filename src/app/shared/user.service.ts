import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }
  readonly BaseURI = environment.baseUrl;

  userObject;
  emailModel = this.fb.group({
    Email: ['',Validators.email]
  });

  ResetPasswordModel = this.fb.group({
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  changePasswordModel = this.fb.group({
    OldPassword: ['',[Validators.required, Validators.minLength(8)]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  formModel = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(3)]],
    LastName: ['',[Validators.required, Validators.minLength(3)]],
    Email: ['', Validators.email],
    Contact: ['', Validators.required],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
      Email: this.formModel.value.Email,
      Contact: this.formModel.value.Contact,
      Password: this.formModel.value.Passwords.Password
    };
    var result = this.http.post(this.BaseURI+'/users/register', body);    
    return result;
  }
  activateUser(Email:string) {
    var body = {
      Email: Email
    };
    var result = this.http.post(this.BaseURI+'/users/register/activateaccount/', body);    
    return result;
  }
  verifyEmailObject;

  verifyEmail() {
    var body = {
      Email: this.emailModel.value.Email
    };
    return this.http.post(this.BaseURI+'/users/verifyemail', body);    
  }
  getUserID(){
    console.log(this.userObject);
    console.log(this.userObject.Id);
    return this.userObject.Id;
  }
  changePassword() {
    var body = {
      OldPassword: this.changePasswordModel.value.OldPassword,
      NewPassword: this.changePasswordModel.value.Passwords.Password
    };

    var result = this.http.put(this.BaseURI+'/users/changepassword/'+localStorage.getItem('userID'), body);    
    return result;
  }

  resetPassword(userID:string){    
    var body = {
      Id: userID,
      Password: this.ResetPasswordModel.value.Password
    };
    var result = this.http.post(this.BaseURI+'/users/resetpassword', body);    
    return result;
  }

  login(formData) {
    return this.http.post(this.BaseURI + '/users/authenticate', formData);
  }
  
}