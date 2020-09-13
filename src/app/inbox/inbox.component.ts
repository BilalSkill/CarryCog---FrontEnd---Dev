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
  isCollapsed = false;
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
   this.prevMessagesCount = 0;
  }
  ngOnDestroy() {
    if (this.MessagesIntervalTimer) {
      clearInterval(this.MessagesIntervalTimer);
    }
  }
  loadpostsUserList(postID: string){
    this.currDiv = postID;
  }
   
  loadMyPostsRequests(): void{
    var result =this._inboxService.getallforuser(localStorage.getItem('userID'));
    result.subscribe(
      (res: any) => {
         if (res.succeeded) {
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
          }
        }
      },
      err => {       
        this.toastr.error(err.error.errors, 'Error');
      }
    );
  }
  getMessagesAndScrollDown(userId:string){   
    //this.getUserMessages(userId);
     if(this.MessagesIntervalTimer != null)
     {
       clearInterval(this.MessagesIntervalTimer);
     }
    this.MessagesIntervalTimer = setInterval(() => {
      
        
     //  if(this.prevMessagesCount == null){
     //    console.log('Timer ticked in if condition');
     // }
    //  if(this.messages != null){
    //    if(this.prevMessagesCount != this.messages.length){
    //      console.log('Scrolling....');       
    //    this.scrollToBottom();
    //  }
    // }else{
    //   console.log('Scrolling....');       
    //    this.scrollToBottom();
    // }
     this.getUserMessages(userId);
     if(this.prevMessagesCount != this.messages.length){
      this.scrollToBottom();
      this.prevMessagesCount = this.messages.length;
    }
    }, 500);
    this.isCollapsed = true;
  }
  getUserMessagesForBackground(userId:String){
    
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
        }
        else{
        this.toastr.error('Error while sending messages.', 'Sending Failed');
        }
      }     
    );
    
  }
  getUserMessages(userId:String){
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
        }
        else{
        this.toastr.error('Error while sending messages.', 'Sending Failed');
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
