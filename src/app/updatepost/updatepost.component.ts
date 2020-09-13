import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/home.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ScriptService } from '../shared/script.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-updatepost',
  templateUrl: './updatepost.component.html',
  styleUrls: ['./updatepost.component.css']
})
export class UpdatepostComponent implements OnInit {

  submitted = false;
  fromCity:string;
  toCity:string;
  fromCityBool:boolean = true;
  toCityBool:boolean = true;
  today: Date;
  maxDate: Date;
  minDate: Date;
  
  Currencies;
  loadAPI: Promise<any>;
  title = 'CarryCog - Update Post';
  constructor(private titleService: Title, private metaService: Meta,private _scriptLoader:ScriptService, public _homeService:HomeService,private toastr:ToastrService, private router:Router) { 
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
  });
  this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
     }
  
  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);


    if(localStorage.getItem('token') !=null){
      this.getListOfCurrencies();
     
    }else{
      this.toastr.error('Please login / register first.', 'No Session Found!');
          this.router.navigateByUrl("/login");
    }
  }
  ngAfterContentInit(): void{
   
  }
  public loadScript() {        
    var isFound = false;
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
getListOfCurrencies(){
  this._homeService.getListOfCurrencies().subscribe(
    (res: any) => {
       if (res.succeeded) {
         this.Currencies = res.data;
      } else {
        console.log(res.errors);
        this.toastr.error(res.errors, 'Error');
      }
    },
    err => {       
      console.log(err.error);
      this.toastr.error(err.error.errors, 'Error');
    }
  );
}


formType:string = "Traveller";
  updateForm(){
    this.formType = this._homeService.EditPostModel.get('PostType').value;
    switch(this.formType) {  
      case "Traveller": { 
         break;
      }
      case "Requester": { 
         break;
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
  this.toCity = toCity;
  
if(this.toCity != ''){
  if(!this.toCity.match('^[^,\n]*((,[^,\n]*){2}$)')){
    this.toCityBool = false;
    }  
    else{
      this.toCityBool = true;
    }
  }
    
}
  onSubmit() {
    this.submitted = true;
   
    var result =this._homeService.editPost(this.fromCity,this.toCity);
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
          this._homeService.EditPostModel.reset();
          this.toastr.success('Post has been updated and waiting for Admins approval.', 'Waiting For Approvals');
          this.router.navigateByUrl("/myposts");
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
