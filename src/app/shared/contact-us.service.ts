import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  readonly BaseURI = environment.baseUrl;

  InsertContactUsRecord = this.fb.group({    
    Name:['', [Validators.required, Validators.minLength(3)]],
    Email:['',Validators.email],
    ContactNumber:['', Validators.minLength(10)],
    Message:['',Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }


  insertRecordContactUs(){   
    console.log(this.InsertContactUsRecord.value);
    var body={
      Name: this.InsertContactUsRecord.value.Name,
      Email: this.InsertContactUsRecord.value.Email,
      ContactNumber: this.InsertContactUsRecord.value.ContactNumber,
      Message: this.InsertContactUsRecord.value.Message,

    }
    return this.http.post(this.BaseURI+'/ContactUs/insertRecord/',body);
  }
}
