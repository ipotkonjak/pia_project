import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { ParticipantComponent } from './participant/participant.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RequestsComponent } from './requests/requests.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UpdateWorkshopComponent } from './update-workshop/update-workshop.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    WelcomeComponent,
    DetailsComponent,
    LoginComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    AddWorkshopComponent,
    WorkshopsComponent,
    ParticipantComponent,
    OrganizerComponent,
    AdminLoginComponent,
    RequestsComponent,
    UpdateUserComponent,
    UpdateWorkshopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
