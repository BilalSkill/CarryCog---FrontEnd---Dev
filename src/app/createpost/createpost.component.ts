import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/home.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ScriptService } from '../shared/script.service';
import { Title, Meta } from '@angular/platform-browser';
import { RefreshHeaderService } from '../shared/refresh-header.service';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {
  submitted = false;
  fromCity:string;
  toCity:string;
  
  fromCityBool:boolean = true;
  toCityBool:boolean = true;
  toCitySameBool:boolean = true;
  TravelError:string = "Travel Date is Required";
  displayTravelError:boolean = false;
  CostError:string = "Cost is Required";
  displayCostError:boolean = true;
  SpaceError:string = "Space Available is Required";
  displaySpaceError:boolean = true;
  formType:string = "Traveller";
  readonly myCutomRegex = '^[^,\n]*((,[^,\n]*){2}$)';
  today: Date;
  maxDate: Date;
  minDate: Date;
  Currencies;
  loadAPI: Promise<any>;
  title = 'CarryCog - Create Post';
  constructor(private titleService: Title, private metaService: Meta,private _scriptLoader:ScriptService,private _headerService:RefreshHeaderService, public _homeService:HomeService,private toastr:ToastrService, private router:Router) { 
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

    if(localStorage.getItem('token')  != null){
    this._homeService.CreatePostModel.reset();
    this.getListOfCurrencies();
    }else{
      this.toastr.error('Please login / register first.', 'No Session Found!');
          this.router.navigateByUrl("/login");
    }
  }
  getListOfCurrencies(){
    this._homeService.getListOfCurrencies().subscribe(
      (res: any) => {
         if (res.succeeded) {
           this.Currencies = res.data;
        } else {
          this.toastr.error(res.errors, 'Error');
        }
      },
      err => {       
        this.toastr.error(err.error.errors, 'Error');
      }
    );
  }

  isFormValid():boolean{
    if(this.fromCityBool == true && this.toCityBool == true && this.toCitySameBool == true){
      this.formType = this._homeService.CreatePostModel.get('PostType').value;
    const TravelDate = this._homeService.CreatePostModel.get('TravelDate').value;
    const Cost = this._homeService.CreatePostModel.get('Cost').value;
    const SpaceAvailable = this._homeService.CreatePostModel.get('SpaceAvailable').value;
    switch(this.formType) {  
      case "Traveller": { 
        if(TravelDate == ''){
          this.displayTravelError = true;
          return false;
        }
        else if(Cost == ''){
          return false;
        }
        else if(SpaceAvailable == ''){
          return false;
        }else{
          return true;
        } 
         break;
      }
      case "Requester": { 
        if(SpaceAvailable == ''){
          return false;
        }
        else{
          return true;
        }
         break;
      }      
   }   
      //return true;
    }
    else{
      return false;
    }
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
      if(this.toCity == this.fromCity){
        this.toCitySameBool = false;
      }
      else{
        this.toCitySameBool = true;
      }
      this.toCityBool = true;
    }
  }
    
}
  onSubmit() {
    if(this.isFormValid){
    this.submitted = true;
    var result =this._homeService.createPost(this.fromCity,this.toCity);
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
          //this._homeService.CreatePostModel.reset();
          this.toastr.success('Post has been created and waiting for Admins approval.', 'Waiting For Approvals');
          this.router.navigateByUrl("/Home");
        } else {
          
          if(res.error != ''){
          this.toastr.error(res.error_description,res.error);
          
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userID');
          this.router.navigate(['/Home']);
          this._headerService.onRefreshHeader();
          }
          else{
            this.toastr.error("Please fill all fields.","Incomplete Form!");
          }
        }
      },
      err => {       
        this.toastr.error("Please fill all fields.","Incomplete Form!");
      }
    );
    }else{
      this.toastr.error("Please fill all fields.","Incomplete Form!");
    }
  }

  
  updateForm(){
    this.formType = this._homeService.CreatePostModel.get('PostType').value;
    // const TravelDate = this._homeService.CreatePostModel.get('TravelDate');
     const Cost = this._homeService.CreatePostModel.get('Cost');
     //const SpaceAvailable = this._homeService.CreatePostModel.get('SpaceAvailable');
    switch(this.formType) {  
      case "Traveller": { 
         break;
      }
      case "Requester": { 
         Cost.setValidators(null);
         break;
      }      
   }
  }

  // onSubmitWithForm(form: NgForm) {
  //   var result =this._homeService.createPostWithForm(form.value);
  //   result.subscribe(
  //     (res: any) => {
  //        if (res.succeeded) {
  //         this._homeService.CreatePostModel.reset();
  //         this.toastr.success('Post has been created and waiting for Admins approval.', 'Waiting For Approvals');
  //         this.router.navigateByUrl("/Home");
  //       } else {
  //         this.toastr.error(res.errors, 'Error');
  //       }
  //     },
  //     err => {       
  //       this.toastr.error(err.error.errors, 'Error');
  //     }
  //   );
  // }

}
