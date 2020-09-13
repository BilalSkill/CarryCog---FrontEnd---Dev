import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { EventEmitter } from 'protractor';
import { RefreshHeaderService } from './shared/refresh-header.service';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { ScriptService } from './shared/script.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MypostsComponent } from './myposts/myposts.component';
import { UpdatepostComponent } from './updatepost/updatepost.component';
import { DatePipe } from '@angular/common';
import { ActivateuserComponent } from './activateuser/activateuser.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { InboxComponent } from './inbox/inbox.component';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FaqComponent } from './faq/faq.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { NgxSocialShareModule } from 'ngx-social-share';
import { NumberDirective } from './numbers-only.directive';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    ActivateuserComponent,
    FooterComponent,
    HomeComponent,
    HeaderComponent,
    ChangepasswordComponent,
    VerifyemailComponent,
    ResetPasswordComponent,
    CreatepostComponent,
    MypostsComponent,
    UpdatepostComponent,
    ActivateuserComponent,
    InboxComponent,
    ContactusComponent,
    AboutusComponent,
    FaqComponent,
    HowitworksComponent,
    TermsofuseComponent,
    PostDetailsComponent,
    NumberDirective
  ],
  imports: [
    NgxSocialShareModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
     ToastrModule.forRoot({
       progressBar: true,
       timeOut: 10000
     }),
    FormsModule,
    NgbModule,
    SocialLoginModule,
    CollapseModule.forRoot(), BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [          
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1168890473484192'),
          },
        ],
      } as SocialAuthServiceConfig,
    }
    ,UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  DatePipe,
RefreshHeaderService,
ScriptService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
