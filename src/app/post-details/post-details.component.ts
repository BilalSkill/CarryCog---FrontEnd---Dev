import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HomeService } from '../shared/home.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  submitted = false;
  fromCity:string;
  toCity:string;
  fromCountry:string;
  toCountry:string;
  postType:string;
  fromCityBool:boolean = true;
  toCityBool:boolean = true;
  limitedPosts;
  public showShareIt:boolean = false;
  public buttonName:any = 'Share Post';
  post;
  postID;
  isCollapsed = true;
  title = 'CarryCog - Post Details';
  readonly myCutomRegex = '^[^,\n]*((,[^,\n]*){2}$)';
  constructor(private titleService: Title, private metaService: Meta,private fb: FormBuilder,private route: ActivatedRoute, private router:Router,private toastr:ToastrService, public _homeService:HomeService, public datepipe: DatePipe) {


    }
   
  ngOnInit(): void {

    this.titleService.setTitle(this.title);
    // this.metaService.addTags([
    //   {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
    //   {name: 'description', content: 'Post Details Page'},
    //   {name: 'image', content:'https://carrycog.com/assets/img/Flag_By_Post/India.jpg'},
    //   {name: 'robots', content: 'home, aboutus'}
    // ]);

    this.postID = this.route.snapshot.paramMap.get('ID');
        this.loadpost(this.postID);
    
  }

  loadpost(postID:string): void{    
    this._homeService.getPost(this.postID).subscribe(
      (res: any) => {
         if (res.succeeded == 'True') {
           
           console.log(res.data);
           this.post = res.data;  
                  
        } else {
          console.log(res.errors);
          this.toastr.error(res.errors, 'Record Not Found!');
          this.router.navigateByUrl('/Home');
        }
      },
      err => {
          console.log(err.message);
          this.toastr.error(err.message, 'Record Not Found!');
          this.router.navigateByUrl('/Home');
      }
    );

  }
  toggleShareIt() {
    this.showShareIt = !this.showShareIt;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.showShareIt)  
      this.buttonName = "Hide Share";
    else
      this.buttonName = "Share Post";
  }

 getCurrentUser():any{
  return localStorage.getItem('userID');
 }

 checkRequestSent(postID):any{
  var post = this.post.find(x => x.PostsID == postID);
  
  if(post.Inboxes.length > 0){

  var exist =  post.Inboxes.find(x => x.FromMessage == localStorage.getItem('userID'));

  if(exist != null){
  return true;
  }
  else{
  return false;
  }
  }
 }
  //Send post type to request service for automated message on request
  //Send fromCity and toCity to request to concatinate in message.
  onRequest(postID){
    var post = this.post.find(x => x.PostsID == postID);
    this._homeService.sendRequest(post).subscribe((res: any) => {
      if (res.succeeded) {
        this.toastr.success("Request has been sent, traveller will be in touch with you soon","Request send!");
     } else {
       
       if(res.error != ''){
       this.toastr.error(res.error_description,res.error);
       
       localStorage.removeItem('token');
       localStorage.removeItem('userName');
       localStorage.removeItem('userID');
       this.router.navigate(['/login']);
       }
       else{
         this.toastr.error(res.errors, 'Error');
       console.log(res.errors);
       }
     }
   },
   err => {       
     console.log(err.error);
     this.toastr.error(err.error.errors, 'Error');
   }
 );
    //this._homeService.sendRequest(post).subscribe((data)=>{
      //console.log(data);
    //});
  }

}
