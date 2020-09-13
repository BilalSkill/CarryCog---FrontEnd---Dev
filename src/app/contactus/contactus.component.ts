import { Component, OnInit } from '@angular/core';
import { ContactUsService } from '../shared/contact-us.service';
import { ToastrService } from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  title = 'CarryCog - Contact Us';
  constructor(private titleService: Title, private metaService: Meta,public _contactService:ContactUsService,private toastr:ToastrService) { 

  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);
    
  }
  onSubmit(){
    this._contactService.insertRecordContactUs().subscribe(
      (res: any) => {
         if (res.succeeded) {
           this.toastr.success('Thank you for contacting CarryCog team, we have received  your message.','Message Received')
           this._contactService.InsertContactUsRecord.reset();
        } else {
          this.toastr.error(res.errors, 'Error');
        }
      },
      err => {       
        this.toastr.error(err.error.errors, 'Error');
      }
    );
  }
  }

