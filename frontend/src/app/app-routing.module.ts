import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { ParticipantComponent } from './participant/participant.component';
import { RegisterComponent } from './register/register.component';
import { RequestsComponent } from './requests/requests.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UpdateWorkshopComponent } from './update-workshop/update-workshop.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WorkshopsComponent } from './workshops/workshops.component';

const routes: Routes = [
  {path:'',component:WelcomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'details/:idW',component:DetailsComponent},
  {path:'login',component:LoginComponent},
  {path:'resetpass',component:ResetPasswordComponent},
  {path:'changepass',component:ChangePasswordComponent},
  {path:'addworksh',component:AddWorkshopComponent},
  {path:'myworksh',component:WorkshopsComponent},
  {path:'participant',component:ParticipantComponent},
  {path:'organizer',component:OrganizerComponent},
  {path:'login/admin',component:AdminLoginComponent},
  {path:'requests',component:RequestsComponent},
  {path:'update/user/:username',component:UpdateUserComponent},
  {path:'update/workshop/:idW',component:UpdateWorkshopComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
