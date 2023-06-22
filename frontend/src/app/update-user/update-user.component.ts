import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Users from '../models/users';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(private route : ActivatedRoute, private service : UsersService, private router : Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    let username = this.route.snapshot.paramMap.get('username');
    this.service.getByUsername(username).subscribe((user : Users) => {
      this.targetUser = user;
      this.changes = JSON.parse(JSON.stringify(this.targetUser));
    })
  }

  user : Users;
  targetUser : Users;
  changes : Users;
  msg : string = "";


  remove() {
    this.changes.photo = "";
  }
  helperUpdate() {
    if(this.targetUser.type == 'organizer') {
      this.service.updateProfile( this.targetUser.username,this.targetUser.email, this.changes.firstname, this.changes.lastname, 
        this.changes.email, this.changes.tel, this.changes.photo, this.targetUser.type, this.changes.orgName, this.changes.orgAddress, this.changes.orgNumber).subscribe((resp) => {
          this.msg = resp['message'];
          this.targetUser = this.changes;
          this.changes = JSON.parse(JSON.stringify(this.targetUser));
        })
    }
    else {
      this.service.updateProfile( this.targetUser.username,this.targetUser.email, this.changes.firstname, this.changes.lastname, 
        this.changes.email, this.changes.tel, this.changes.photo, this.targetUser.type, null, null, null).subscribe((resp) => {
          this.msg = resp['message'];
          this.targetUser = this.changes;
          this.changes = JSON.parse(JSON.stringify(this.targetUser));
        })
    }
    
  }
  update() {
    if(this.targetUser.email != this.changes.email) {
      this.service.checkEmail(this.changes.email).subscribe((user) => {
        if(user != null) {
          this.msg = "Vec postoji korisnik sa navedenim email-om";
        }
        else {
          this.helperUpdate();
        }
      })
    }
    else this.helperUpdate();
    
  }

  cancel() {
    this.router.navigate(['requests']);
  }

  @ViewChild('fileUploadConvert') fileUploadConvert : ElementRef;

  getPhoto(event:Event) {
    this.msg = "";
    var image=new Image();
    const file=(event.target as HTMLInputElement).files[0];
    const allowedTypes=["image/png","image/jpeg","image/jpg"];
    if(file && allowedTypes.includes(file.type)){
      const reader = new FileReader();
      reader.onload=()=>{
        this.changes.photo = reader.result as string;
        image.src = this.changes.photo;    
        
        if(image.height > 300 || image.width > 300 || image.height < 100 ||image.width < 100){
          this.msg = "Nedozvoljen format slike!";
          this.changes.photo = "";
          this.fileUploadConvert.nativeElement.value = null;
          return;
        }
      }
      reader.readAsDataURL(file);
    }
    
  }
}
