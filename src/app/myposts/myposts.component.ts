import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';
import * as data from '../JsonData/FilteredCities.json';
import { DatePipe } from '@angular/common'
import { Title, Meta } from '@angular/platform-browser';
import { RefreshHeaderService } from '../shared/refresh-header.service';
import { ToastRef, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.css']
})
export class MypostsComponent implements OnInit {
  
  postResults;
  post;
  loadAPI: Promise<any>;
  
title = 'CarryCog - My Posts';
  constructor(private titleService: Title, private metaService: Meta,private router:Router,private _headerService:RefreshHeaderService, public _homeService:HomeService,private toastr:ToastrService,public datepipe: DatePipe) {   
   }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);

    if(localStorage.getItem('token')!=null){
    this.loadMyPosts();
  }else{
    this.toastr.error('Please login / register first.', 'No Session Found!');
        this.router.navigateByUrl("/login");
  }
  }
  
  loadMyPosts(): void{
    var result =this._homeService.getAllPostsForUser(localStorage.getItem('userID'));
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
           this.postResults = res.data;
        } else {
          
          if(res.error != ''){
          this.toastr.error(res.error_description,res.error);
          
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userID');
          this.router.navigate(['/login']);
          this._headerService.onRefreshHeader();
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
  }
  onPostEdit(postID){
      
    this._homeService.updatePostForUser(postID).subscribe(
      (res: any) => {
         if (res.succeeded == 'True') {
           console.log(res.data[0]);
          this._homeService.CurrencyValueFromPost = res.data[0].CountryCode;
          console.log("In My Posts component: "+this._homeService.CurrencyValueFromPost);
          this._homeService.EditPostModel.patchValue(res.data[0]);
        } else {
          console.log(res.errors);
        }
      },
      err => {
          console.log(err.message);
      }
    );
    
    this.router.navigateByUrl('/updatepost');
  }
}
