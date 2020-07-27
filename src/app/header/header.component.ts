import { RefreshHeaderService } from '../shared/refresh-header.service';
import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';
import * as data from '../JsonData/FilteredCities.json';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loadAPI: Promise<any>;
  userName: string;
  isCollapsed = true;
  angularVersion: string;
  navbarCollapsed = true;
  navbarDropDown = true;
  CountryName;
  constructor(private _homeService:HomeService , private router:Router,private _headerService:RefreshHeaderService) { 

  }
  token: boolean = false;
  ngOnInit(): void {
    this.getCountryLocation();
    if (this._headerService.subsVar==undefined) {    
      this._headerService.subsVar = this._headerService.    
      RefreshHeader.subscribe((name:string) => {    
        this.RefreshNavBar();    
      });    
    } 
    this.RefreshNavBar();
  }
  getCountryLocation(){
    this._homeService.getCountryLocation().subscribe(
      (res: any) => {
        this.CountryName = res.country_flag; 
        localStorage.setItem('offSet',res.time_zone.offset);
      },
      err => {
          console.log(err.message);
      }
    );
  }
  toggleIsCollapse(){
    if(this.isCollapsed)
      this.isCollapsed = false;
    else
      this.isCollapsed = true;
  }
  RefreshNavBar(){
    this.userName = localStorage.getItem('userName');
    console.log(this.userName);
    if (localStorage.getItem('token') != null)
    this.token = true;
    else
    this.token = false;
  }
  
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userID');
    this.userName = '';
    this.router.navigate(['/Home']);
    this.RefreshNavBar();
  }

}
