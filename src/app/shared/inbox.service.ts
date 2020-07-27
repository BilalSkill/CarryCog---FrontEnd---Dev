import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InboxService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }
  readonly BaseURI = environment.baseUrl;

  RequestModel = {   
    FromMessage: [''], 
    ToMessage: [''],
    Message: ['']
  }

  getallforuser(userID:string){
    return this.http.get(this.BaseURI+'/inbox/getallforuser/' + userID);
  }
  
  getallMessagesforuser(post_userID:string){
    return this.http.get(this.BaseURI+'/inbox/getallmesssages/' + post_userID);
  }

  sendMessage(postID: string,ToMessage:string,Message:string){
    var body = {
      ToMessage: ToMessage,
      Message: Message,
      FromMessage: localStorage.getItem("userID")
    }
    return this.http.post(this.BaseURI+'/inbox/sendmessage/' + postID,body);
  }
  
}
