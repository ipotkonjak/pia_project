import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatsService } from '../chats.service';
import { MainService } from '../main.service';
import Chats from '../models/chats';
import Comments from '../models/comments';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { UsersService } from '../users.service';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  constructor(private service : WorkshopsService, private service_user : UsersService, private router : Router, private main_service : MainService,
    private service_chats : ChatsService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.service.getForUserOver(this.user.email).subscribe((data : Workshops[]) => {
      this.workshops = data;
    })
    this.service.getLikesForUser(this.user.username).subscribe((data : Workshops[]) => {
      this.likes = data;
    })
    this.service.getCommentsForUser(this.user.username).subscribe((data : Comments[]) => {
      this.comments = data;
    })
    this.service_chats.getAllParticipant(this.user.username).subscribe((data : Chats[]) => {
      this.chats = data;
    })
  }

  user : Users;
  workshops : Workshops[] = [];
  flag : boolean = false;
  changes : Users;
  msg : string = "";

  comments : Comments[];
  likes : Workshops[];
  chats : Chats[];

  sendingMessage : boolean = false;
  chat : Chats = null;
  message : string = "";

  chosen : string = "worksh";
  comment : Comments = null;


  details(idW) {
    this.router.navigate(['details', idW]);
  }
  choose(c) {
    this.chosen = c;
  }

 openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  // document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
 closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  // document.getElementById("main").style.marginLeft = "0";
}

  removeLike(idW) {
    this.service.removeLikeForUser(this.user.username, idW).subscribe((resp) => {
      this.service.getLikesForUser(this.user.username).subscribe((data : Workshops[]) => {
        this.likes = data;
      })
    })
  }

  updateComment(c) {
    this.comment = JSON.parse(JSON.stringify(c));
  }

  updateCommentDatabase() {
    this.service.editCommentForUser(this.user.username, this.comment.date, this.comment.text).subscribe((resp) => {
      this.comment = null;
      this.service.getCommentsForUser(this.user.username).subscribe((data : Comments[]) => {
        this.comments = data;
      })
    });
  }

  discardComment() {
    this.comment = null;
  }

  removeComment(date) {
    this.service.removeCommentForUser(this.user.username, date).subscribe((resp) => {
      this.service.getCommentsForUser(this.user.username).subscribe((data : Comments[]) => {
        this.comments = data;
      })
    })
  }

  sendMessage() {
      this.service_chats.sendMessage(this.user.username, this.chat.workshop, this.user.username, new Date(Date.now()), this.message).subscribe((resp) => {
        this.service_chats.getOneChat(this.user.username, this.chat.workshop).subscribe((data : Chats) => {
          this.chat = data;
          this.chat.messages = this.chat.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        })
      }
      )
    
  }

  openChat(c) {
    if(this.chat!= null && this.chat.workshop == c.workshop && this.chat.participant == c.participant) return;
    this.chat = c;
    this.chat.messages = this.chat.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.sendingMessage = true;
    this.service_chats.getAllParticipant(this.user.username).subscribe((data : Chats[]) => {
      this.chats = data;
    })
    
  }

  closeChat() {
    this.sendingMessage = false;
    this.service_chats.getAllParticipant(this.user.username).subscribe((data : Chats[]) => {
      this.chats = data;
    })
    this.chat = null;
  }

  updateProfile() {
    this.changes = JSON.parse(JSON.stringify(this.user));
    this.flag = true;
  }

  helperUpdate() {
    this.service_user.updateProfile( this.user.username,this.user.email, this.changes.firstname, this.changes.lastname, 
      this.changes.email, this.changes.tel, this.changes.photo, this.user.type, null, null, null).subscribe((resp) => {
        this.msg = resp['message'];
        this.user = this.changes;
        localStorage.setItem('user', JSON.stringify(this.user));
      })
    this.flag = false;
  }
  update() {
    if(this.user.email != this.changes.email) {
      this.service_user.checkEmail(this.changes.email).subscribe((user) => {
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
    this.flag = false;
  }

  @ViewChild('fileUploadConvert') fileUploadConvert : ElementRef;

  onFileSelected(event:Event) {
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
