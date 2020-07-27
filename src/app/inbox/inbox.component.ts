import { Component, OnInit,
  AfterViewInit, ViewChild, ViewChildren, ElementRef,   QueryList, HostListener } from '@angular/core';
import { InboxService } from '../shared/inbox.service';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  /*Logic For Auto Scrolling... */
  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  
  private scrollContainer: any;
  private isNearBottom = true;
  /////
  ///
  //
  channel:boolean = true;
  username = 'Bilal';
  messages;
  newMessage = '';
  prevMessagesCount;
  postsList=[]
  postsUsersList=[]
  chatClient;
  MessagesIntervalTimer;
  currentUser ={
    ID: localStorage.getItem('userID'),
    Name: localStorage.getItem('userName')
    }
  currDiv: string;
  currUserMessages;
  title = 'CarryCog - Inbox';
    //  isShown: string = ; // hidden by default 
  constructor(private titleService: Title, private metaService: Meta,public _inboxService:InboxService,private router:Router,private toastr:ToastrService, public datepipe: DatePipe) { }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'CarryCog, Logistics, Delivery, Travelling, Carrying, Parsel'},
      {name: 'description', content: 'Cargo takes more than 30 days to deliver while the epxress delivery charges way more money keeping this is mind we have developed this free solution which saves both time and money'},
      {name: 'robots', content: 'home, aboutus'}
    ]);

   this.loadMyPostsRequests();
  }
  ngOnDestroy() {
    if (this.MessagesIntervalTimer) {
      clearInterval(this.MessagesIntervalTimer);
    }
  }
  loadpostsUserList(postID: string){
    console.log('div to hide is '+postID);
    this.currDiv = postID;
  }
  // loadpostsUserList(): void{
  //   var result =this._inboxService.getallforuser(localStorage.getItem('userID'));
  //   result.subscribe(
  //     (res: any) => {
  //        if (res.succeeded) {
  //          console.log(res.data);
  //          this.postsUsersList = res.data;
  //       } else {
          
  //         if(res.error != ''){
  //         this.toastr.error(res.error_description,res.error);
          
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('userName');
  //         localStorage.removeItem('userID');
  //         this.router.navigate(['/login']);
  //         }
  //         else{
  //           this.toastr.error(res.errors, 'Error');
  //         console.log(res.errors);
  //         }
  //       }
  //     },
  //     err => {       
  //       console.log(err.error);
  //       this.toastr.error(err.error.errors, 'Error');
  //     }
  //   );
  // }
  
  loadMyPostsRequests(): void{
    var result =this._inboxService.getallforuser(localStorage.getItem('userID'));
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
           console.log(res.data);
           this.postsList = res.data;
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
  }
  getMessagesAndScrollDown(userId:string){   
    console.log("Get Messages And ScrollDown...");
    this.prevMessagesCount = null; 
    this.getUserMessages(userId);
    if(this.MessagesIntervalTimer != null)
    {
      clearInterval(this.MessagesIntervalTimer);
    }
    this.MessagesIntervalTimer = setInterval(() => {
      
      console.log("Previous Messages From last request "+this.prevMessagesCount);
      console.log("Current List Of Messages Count "+this.messages.length);
      if(this.prevMessagesCount < this.messages.length){
      this.getUserMessagesForBackground(userId);
      this.scrollToBottom();
    }
    }, 500);
    
  }
  getUserMessagesForBackground(userId:String){
    console.log("Get User Messages For Background...");
    
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.currUserMessages = userId;
    var result = this._inboxService.getallMessagesforuser(this.currDiv+'|'+userId+'|'+this.currentUser.ID+'|'+localStorage.getItem('offSet'));
    result.subscribe(
      (res: any) => {        
        if(this.prevMessagesCount == null){
          this.messages = res;
          this.prevMessagesCount = this.messages.length;
        }else if(this.prevMessagesCount < this.messages.length){
          this.messages = res;
          this.prevMessagesCount = this.messages.length;
        }
      },
      err => {
        if (err.status == 400){
         this.toastr.error(err.error.message, 'Sending Failed');
         console.log(err.error.message);
        }
        else{
        this.toastr.error('Error while sending messages.', 'Sending Failed');
        console.log(err);
        }
      }     
    );
    
  }
  getUserMessages(userId:String){
    console.log("Get User Messages...");
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.currUserMessages = userId;
    var result = this._inboxService.getallMessagesforuser(this.currDiv+'|'+userId+'|'+this.currentUser.ID+'|'+localStorage.getItem('offSet'));
    result.subscribe(
      (res: any) => {        
          this.messages = res;
      },
      err => {
        if (err.status == 400){
         this.toastr.error(err.error.message, 'Sending Failed');
         console.log(err.error.message);
        }
        else{
        this.toastr.error('Error while sending messages.', 'Sending Failed');
        console.log(err);
        }
      }     
    );
    
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }
  sendMessage(){
    var resutl = this._inboxService.sendMessage(this.currDiv,this.currUserMessages,this.newMessage);
    this.getMessagesAndScrollDown(this.currUserMessages);
    this.newMessage = null;
    resutl.subscribe(
      (res: any) => {         
         
       },
       err => {
         if (err.status == 400){
          this.toastr.error(err.error.message, 'Sending Failed');
          console.log(err.error.message);
         }
         else{
         this.toastr.error('Error while sending messages.', 'Sending Failed');
         console.log(err);
         }
       }     
     );
  }
}
