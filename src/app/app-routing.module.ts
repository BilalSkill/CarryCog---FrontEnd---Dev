import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './registration/registration.component';
import { AppComponent }          from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { MypostsComponent } from './myposts/myposts.component';
import { UpdatepostComponent } from './updatepost/updatepost.component';
import { ActivateuserComponent } from './activateuser/activateuser.component';
import { InboxComponent } from './inbox/inbox.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { FaqComponent } from './faq/faq.component';
import { PostDetailsComponent } from './post-details/post-details.component';


const routes: Routes = [
  {path:'', component: HomeComponent },
  {path:'Home', component: HomeComponent},
  {path:'createpost', component: CreatepostComponent},
  {path:'login', component: LoginComponent},
  {path:'verifyemail', component: VerifyemailComponent},
  {path:'resetpassword/:ID', component: ResetPasswordComponent},
  {path:'changepassword', component: ChangepasswordComponent},
  {path:'registration', component: RegistrationComponent},
  {path:'myposts',component: MypostsComponent},
  {path:'updatepost', component: UpdatepostComponent},
  {path:'activateuser/:Email',component: ActivateuserComponent},
  {path:'inbox',component:InboxComponent},
  {path:'contact',component:ContactusComponent},
  {path:'about',component:AboutusComponent},
  {path:'howitworks',component:HowitworksComponent},
  {path:'termsofuse',component:TermsofuseComponent},
  {path:'faq',component:FaqComponent},
  {path:'postdetails/:ID', component: PostDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
