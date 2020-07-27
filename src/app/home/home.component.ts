import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  url = 'http://jasonwatmore.com';
    text = `Jason Watmore's Blog | A Web Developer in Sydney`;
    imageUrl = 'http://jasonwatmore.com/_content/images/jason.jpg';

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
  postResults;
  CountryName;
  SearchOptions: string[] = ['Search For', 'Traveler (Carrier)', 'Requester'];
  default: string = 'Search For';
  isCollapsed = true;
  loadAPI: Promise<any>;
  title = 'CarryCog - Home';
  readonly myCutomRegex = '^[^,\n]*((,[^,\n]*){2}$)';
  constructor(private titleService: Title, private metaService: Meta,private fb: FormBuilder, private router:Router,private toastr:ToastrService, public _homeService:HomeService, public datepipe: DatePipe) {
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
  });

  this.SearchPostsModel.controls['PostType'].setValue(this.default, {onlySelf: true});
    }
   
  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    // this.metaService.addTags([
    //   {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
    //   {name: 'description', content: 'Home page'},
    //   {name: 'image', content:'https://carrycog.com/assets/img/Flag_By_Post/pakistan.jpg'},
    //   {name: 'robots', content: 'home, aboutus'}
    // ]);

    this.metaService.addTags([
      {name: 'og:title', content:'CarryCog - Home'},
      {name: 'og:image', content:'https://carrycog.com/assets/img/Flag_By_Post/pakistan.jpg'},
    ]);

    this._homeService.getCountryLocation().subscribe(
      (res: any) => {
        this.CountryName = res.country_name; 
        console.log("Country Name from On Init: " + this.CountryName);
        this.loadposts(this.CountryName);
      },
      err => {
          console.log(err.message);
          this.loadpostsWithOutCountryFilter();
      }
    );
    
  }
  public loadScript() {        
    var isFound = false;
    console.log('inside load script function');
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
            isFound = true;
        }
    }

    if (!isFound) {
        var dynamicScripts = ["./assets/js/jquery.js","./assets/js/moment.js","./assets/js/bootstrap.js"
        ,"./assets/js/owl-carousel.js"
        ,"./assets/js/blur-area.js"
,"./assets/js/icheck.js"
,"./assets/js/gmap.js"
,"./assets/js/magnific-popup.js"
,"./assets/js/ion-range-slider.js"
,"./assets/js/sticky-kit.js"
,"./assets/js/smooth-scroll.js"
,"./assets/js/fotorama.js"
,"./assets/js/bs-datepicker.js"
,"./assets/js/typeahead.js"
,"./assets/js/quantity-selector.js"
,"./assets/js/countdown.js"
,"./assets/js/window-scroll-action.js"
,"./assets/js/fitvid.js"
,"./assets/js/youtube-bg.js"
,"./assets/js/custom.js"];

        for (var i = 0; i < dynamicScripts.length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('body')[0].appendChild(node);
        }

    }
}
fromCityChange(fromCity: string){
  this.fromCity = fromCity;
  if(this.fromCity != ''){
  if(!this.fromCity.match('^[^,\n]*((,[^,\n]*){2}$)')){
  this.fromCityBool = false;
  }
  else{
    this.fromCityBool = true;
  }
}
 
}
ToCityChange(toCity: string){
  console.log(toCity);
this.toCity = toCity;
if(this.toCity != ''){
if(!this.toCity.match('^[^,\n]*((,[^,\n]*){2}$)')){
  this.toCityBool = false;
  console.log('In if statement of toCity: '+this.toCityBool);
  console.log(this.toCity);
  }
  else{
    this.toCityBool = true;
    console.log('In Else statement of toCity: '+this.toCityBool);
    console.log(this.toCity);
  }
}  
}
SearchPostsModel = this.fb.group({
  FromCity: ['', { updateOn: "blur" }],
  ToCity: ['', { updateOn: "blur" }],
  PostType: ['', Validators.required]
});
loadpostsWithOutCountryFilter(): void{    
  this._homeService.loadpostsWithOutCountryFilter().subscribe(
    (res: any) => {
       if (res.succeeded == 'True') {
         
         console.log(res.data);
         this.postResults = res.data;  
                
      } else {
        console.log(res.errors);
       // this.postResults = res.data;
       // this.toastr.error(res.errors, 'No Record Found!');
      }
    },
    err => {
      // if(err.message.includes('Http failure')){
      //   this.toastr.error("Server not available",'Error');
      // }
      // else{
        console.log(err.message);
      // this.toastr.error(err.message, 'Error');
      // }
    }
  );

}
  loadposts(countryName:string): void{    
    console.log("Country Name From Load Posts is: "+countryName);
    this._homeService.getAllPosts(countryName).subscribe(
      (res: any) => {
         if (res.succeeded == 'True') {
           
           console.log(res.data);
           this.postResults = res.data;  
                  
        } else {
          console.log(res.errors);
         // this.postResults = res.data;
         // this.toastr.error(res.errors, 'No Record Found!');
        }
      },
      err => {
        // if(err.message.includes('Http failure')){
        //   this.toastr.error("Server not available",'Error');
        // }
        // else{
          console.log(err.message);
        // this.toastr.error(err.message, 'Error');
        // }
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
  onClickSearch() {
    this.submitted = true;
    this.SearchPostsModel.value.FromCity = this.fromCity;
    this.SearchPostsModel.value.ToCity = this.toCity;
    this.postType = this.SearchPostsModel.value.PostType;
    console.log(this.SearchPostsModel);
    if(this.toCity.match('^[^,\n]*((,[^,\n]*){2}$)') && this.fromCity.match('^[^,\n]*((,[^,\n]*){2}$)') && this.postType != ''){
     this._homeService.searchPosts(this.fromCity,this.toCity,this.postType).subscribe(
      (res: any) => {
         if (res.succeeded == 'True') {
           this.postResults = res.data;          
        } else {
          console.log(res.errors);
          this.postResults = res.data;
          this.toastr.error(res.errors, 'No Record Found!');
        }
      },
      err => {
        // if(err.message.includes('Http failure')){
        //   this.toastr.error("Server not available",'Error');
        // }
        // else{
          console.log(err.message);
        // this.toastr.error(err.message, 'Error');
        // }
      }
    );
  }else{
  this.loadposts(this.CountryName);
  }
 }

 getCurrentUser():any{
  return localStorage.getItem('userID');
 }

 checkRequestSent(postID):any{
  var post = this.postResults.find(x => x.PostsID == postID);
  
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
    var post = this.postResults.find(x => x.PostsID == postID);
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
