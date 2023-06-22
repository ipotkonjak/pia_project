import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import Users from '../models/users';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private service : UsersService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
    this.admin = JSON.parse(localStorage.getItem('user'));
  }

  admin : Users = null;

  username : string = "";
  password : string = "";
  confirmPass : string = "";
  firstname : string = "";
  lastname : string = "";
  email : string = "";
  tel : string = "";
  photo : string = "";
  type : string = "";
  msg : string = "";
  msgSuccess : string = "";

  orgName : string = "";
  country : string = "";
  city : string = "";
  postalCode : number = 0;
  street : string = "";
  streetNumber : number = 0;
  orgNumber : string = "";

  @ViewChild('fileUploadConvert') fileUploadConvert : ElementRef;

  getPhoto(event:Event) {
    this.msg = "";
    var image=new Image();
    const file=(event.target as HTMLInputElement).files[0];
    const allowedTypes=["image/png","image/jpeg","image/jpg"];
    if(file && allowedTypes.includes(file.type)){
      const reader = new FileReader();
      reader.onload=()=>{
        this.photo = reader.result as string;
        image.src = this.photo;    
        
        if(image.height > 300 || image.width > 300 || image.height < 100 ||image.width < 100){
          this.msg = "Nedozvoljen format slike!";
          this.photo = "";
          this.fileUploadConvert.nativeElement.value = null;
          return;
        }
      }
      reader.readAsDataURL(file);
    }
    
  }

  register() {
    this.msg = "";
    this.msgSuccess = "";
    if(this.username == "" || this.password == "" || this.firstname == "" || this.lastname == "" ||  this.email == "" 
    || this.tel == "" || this.type == "" || this.confirmPass == "") {
      this.msg = "Uneti potrebne podatke!";
      return;
    }

    if (this.password.length < 8 || this.password.length > 16 || !/^[a-zA-Z]/.test(this.password) || !/[A-Z]/.test(this.password) ||
          !/[0-9]/.test(this.password) || !/[@|\\|!|,|\.|\/|*|+]/.test(this.password)) {
      this.msg = "Pogresan format lozinke!";
      return;
    }
    if (this.password != this.confirmPass) {
      this.msg = "Lozinka i potvrda se ne poklapaju!";
      return;
    }

    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
      this.msg = "Uneti ispravan email!";
      return;
    }
    // alert(this.username + " " + this.email);
    
    this.service.checkData(this.username, this.email).subscribe((user : Users) => {
      if(user == null) {
        let status = this.admin != null ? "active" : "waiting";
        if(this.type == "organizer") {
          let orgAddress = {
            "country" : this.country,
            "city" : this.city,
            "postalCode" : this.postalCode,
            "street" : this.street,
            "streetNumber" : this.streetNumber
          }
          this.service.register(this.username, this.password, this.firstname, this.lastname, this.email, this.tel, this.photo, this.type, this.orgName, orgAddress, this.orgNumber, status).subscribe((resp) => {
            this.msgSuccess = resp['message'];
            this.msg = "";
          });
        }
        else {
          this.service.register(this.username, this.password, this.firstname, this.lastname, this.email, this.tel, this.photo, this.type, null, null, null, status).subscribe((resp) => {
            this.msgSuccess = resp['message'];
            this.msg = "";
          });

        }
        
      }
      else {
        this.msg = "Vec postoji nalog sa navedenim username-om/email-om!"
      }
    })
  }

  remove() {
    this.photo = "";
  }
}
