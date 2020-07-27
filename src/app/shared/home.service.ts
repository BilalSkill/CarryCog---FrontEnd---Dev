import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { CreatepostComponent } from '../createpost/createpost.component';
import { UserService } from './user.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  //RequestBody
  
  constructor(private fb: FormBuilder, private http: HttpClient, private userInfo:UserService) { }
  readonly BaseURI = environment.baseUrl;
  readonly myCutomRegex = '^[^,\n]*((,[^,\n]*){2}$)';
  readonly CustomRegexForInteger = '^[0-9]+$';
CurrencyValueFromPost; //Because I am unable to read value from reactive form using this variable for that...!
  CreatePostModel = this.fb.group({    
    FromCity: ['', { validators: [Validators.required], updateOn: "blur" }],
    ToCity: ['', { validators: [Validators.required], updateOn: "blur" }],
    TravelDate: [''],//, { validators:[Validators.required]}],
    Cost: ['',Validators.pattern(this.CustomRegexForInteger)],//,{ validators:[Validators.required]}],
    SpaceAvailable: ['',Validators.pattern(this.CustomRegexForInteger)],//,{ validators:[Validators.required]}],
    Details: [''],
    PostType: [''],
    Currency: ['']
  });
  
  EditPostModel = this.fb.group({   
    PostsID: [''], 
    PostNumber: [''],
    FromCity: ['', { validators: [Validators.required,Validators.pattern(this.myCutomRegex)] }],
    ToCity: ['', { validators: [Validators.required,Validators.pattern(this.myCutomRegex)] }],
    TravelDate: ['2020-02-02'],
    Cost: ['0'],
    SpaceAvailable: [''],
    Details: [''],
    PostType: [''],
    CountryCode: [''],
    UserID:[''],
    FromCountry:[''],
    ToCountry:['']
  });

  ListOfCities;

  getAllPosts(countryName:string) {
    console.log("Country Name at the time of API calling: "+countryName);
    return this.http.get(this.BaseURI+'/posts/getAllPosts/'+countryName);
  }
  getPost(postID:string){
    return this.http.get(this.BaseURI+'/posts/'+postID);
  }
  getAllPostsForUser(userID:string) {
    return this.http.get(this.BaseURI+'/posts/getallpostforuser/'+userID);
  }
  updatePostForUser(postID){
    return this.http.get(this.BaseURI+'/posts/'+postID);
  }
  togglePostType(e){
    this.CreatePostModel.value.PostType = e.target.checked;    
  }

  createPost(FromCity:string,ToCity:string){   
    console.log(this.CreatePostModel.value);
    var body={
    FromCity: FromCity,
    ToCity: ToCity,
    TravelDate: this.CreatePostModel.value.TravelDate != null ? this.CreatePostModel.value.TravelDate : '2020-02-02',
    Cost: this.CreatePostModel.value.Cost != null ? this.CreatePostModel.value.Cost : 0,
    SpaceAvailable: this.CreatePostModel.value.SpaceAvailable,
    Details: this.CreatePostModel.value.Details,        
    PostType: this.CreatePostModel.value.PostType,
    CurrencySymbols: this.CreatePostModel.value.PostType == "Traveller" ? this.CreatePostModel.value.Currency : '74',
    }
    var userID = localStorage.getItem('userID');
    return this.http.post(this.BaseURI+'/posts/createpost/'+userID,body);
  }

  editPost(FromCity:string,ToCity:string){  

    var body={
    postID:this.EditPostModel.value.PostsID,
    FromCity: FromCity ?? this.EditPostModel.value.FromCity,
    ToCity: ToCity ?? this.EditPostModel.value.ToCity,
    TravelDate: this.EditPostModel.value.TravelDate,
    Cost: this.EditPostModel.value.Cost,
    SpaceAvailable: this.EditPostModel.value.SpaceAvailable,
    Details: this.EditPostModel.value.Details,        
    PostType: this.EditPostModel.value.PostType,
    CurrencySymbols: this.EditPostModel.value.CountryCode
    }
    var postID = body.postID;
    return this.http.put(this.BaseURI+'/posts/update/'+postID,body);
  }

  createPostWithForm(formData){   
    var body = formData;
    var userID = localStorage.getItem('userID');
    return this.http.post(this.BaseURI+'/posts/createpost/'+userID,body);
  }
  loadpostsWithOutCountryFilter(){
    return this.http.get(this.BaseURI+'/posts');
  }
  getCountryLocation(){
    var result = this.http.get('https://api.ipgeolocation.io/ipgeo?apiKey=4eb1910dcfe64653a7eea08c79d1cd0c');
    return result;
  }

  searchPosts(FromCity:string,ToCity:string,PostType:string){
    var body = {
      FromCity: FromCity,
      ToCity: ToCity,
      PostType: PostType
    };
    var result = this.http.post(this.BaseURI+'/posts/SearchPosts', body);    
    return result;
  }
  sendRequest(post){
    var message = null;

    if(post.PostType == 'Traveller')
    message = 'Hey, I am interested in your post, that you are traveling from '+post.FromCity+' to '+post.ToCity+'. I just wanted to order something please reply back. Thanks';
    else
    message = 'Hey, I am interested in your post, that you are looking for someone coming from '+post.FromCity+' to '+post.ToCity+'. I have free space please reply back. Thanks';

    var body = {
      FromMessage: localStorage.getItem('userID'),
      ToMessage: post.UserID,
      Message: message
    };
    console.log(body);
   return this.http.post(this.BaseURI+'/Inbox/requestpost/'+post.PostsID,body);
   
  }
  getListOfCurrencies(){
    return this.http.get(this.BaseURI+'/posts/getcurrencies');
  }

}
