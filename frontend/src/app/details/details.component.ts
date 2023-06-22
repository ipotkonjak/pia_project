import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../main.service';
import Comments from '../models/comments';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { WorkshopsService } from '../workshops.service';

import * as L from 'leaflet';
import { ChatsService } from '../chats.service';
import Chats from '../models/chats';
import Messages from '../models/messages';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private route : ActivatedRoute, private serivce : WorkshopsService, private router : Router, private main_service : MainService,
    private service_chats : ChatsService, private servise_user : UsersService) { }

 map : any;
  ngOnInit(): void {
    
    this.user = JSON.parse(localStorage.getItem('user'));
    let idW = parseInt(this.route.snapshot.paramMap.get('idW'));
    this.serivce.getById(idW).subscribe((data : Workshops) => {
      this.workshop = data;

      
      this.data = "data:text/json;charset=utf-8," + JSON.stringify(this.workshop);
      if(this.user.type == 'participant') {
        this.flag = (this.workshop.participants.indexOf(this.user.email) == -1 ? false : true);
        this.flag = this.flag || (this.workshop.waiting.indexOf(this.user.email) == -1 ? false : true);
        this.flag = this.flag || (this.workshop.toNotify.indexOf(this.user.email) == -1 ? false : true);

        this.serivce.checkNameParticipant(this.workshop.name, this.user.email).subscribe((data : Workshops[]) => {
          this.likesFlag = data.length > 0;
          if(this.workshop.likes.findIndex(e => e == this.user.username) != -1) this.likesFlag = false;
        })
        this.serivce.getAllLikes(this.workshop.idW).subscribe((data : String[]) => {
          this.likes = data;
        })
        this.serivce.getAllComments(this.workshop.idW).subscribe((data : Comments[]) => {
          this.comments = data;
        })

        this.servise_user.getByUsername(this.workshop.organizer).subscribe((data : Users) => {
          this.organizer = data;
        })
      }
      else if(this.user.type == 'organizer') {
        this.flag = this.workshop.organizer == this.user.username;
        if(this.workshop.status != 'active' || new Date(this.workshop.date) < new Date(Date.now())) this.flag = false;
      }
      else {
        this.flag = true;
        if(this.workshop.status != 'active' || new Date(this.workshop.date) < new Date(Date.now())) this.flag = false;
      }

      this.serivce.getCoordinates(this.workshop.place).subscribe((resp) => {
        this.coordinates = resp[0];
        // alert(this.coordinates['lon'] + " "+ this.coordinates['lat']);
        this.map = L.map('myMap').setView([this.coordinates['lat'], this.coordinates['lon']], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
        L.marker([this.coordinates['lat'], this.coordinates['lon']]).addTo(this.map);
      })

      this.service_chats.getOneChat(this.user.username, this.workshop.idW).subscribe((data : Chats) => {
        this.chat = data;
        if(this.chat != null) this.messages = this.chat.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    })
    
    
  }

  workshop : Workshops;
  organizer : Users = null;

  user : Users;
  flag : boolean = false;
  msg : string = "";
  updateInProgress = false;
  changes : Workshops;
  data : string;
  likesFlag : boolean = false;
  likes : String[] = [];
  comments : Comments[] = [];
  text : String = "";
  coordinates : JSON;

  sendingMessage : boolean = false;
  chat : Chats = null;
  messages : Array<Messages> = [];
  message : string = "";

  sendMessage() {
    if(this.chat == null) {
      this.service_chats.startChat(this.user.username, this.workshop.idW, this.workshop.mainPhoto, this.user.username, new Date(Date.now()), this.message, this.user.photo).subscribe((resp) => {
        this.service_chats.getOneChat(this.user.username, this.workshop.idW).subscribe((data : Chats) => {
          this.chat = data;
          this.message = "";
          if(this.chat != null) this.messages = this.chat.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        })
      })
    }
    else {
      this.service_chats.sendMessage(this.user.username, this.workshop.idW, this.user.username, new Date(Date.now()), this.message).subscribe((resp) => {
        this.service_chats.getOneChat(this.user.username, this.workshop.idW).subscribe((data : Chats) => {
          this.chat = data;
          this.message = "";
          if(this.chat != null) this.messages = this.chat.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        })
      })
    }
  }

  openChat() {
    this.sendingMessage = true;
  }

  closeChat() {
    this.sendingMessage = false;
  }

  like() {
    this.serivce.addLike(this.workshop.idW, this.user.username).subscribe((resp) => {
      this.serivce.getById(this.workshop.idW).subscribe((data : Workshops) => {
        this.workshop = data;
        this.likes = this.workshop.likes;
        this.comments = this.workshop.comments;
        this.likesFlag = false;
      })
    })
  }

  comment() {
    this.serivce.addComment(this.workshop.idW, this.user.username, new Date(Date.now()), this.text, this.user.photo).subscribe((resp) => {
      this.serivce.getById(this.workshop.idW).subscribe((data : Workshops) => {
        this.workshop = data;
        this.text = "";
        this.likes = this.workshop.likes;
        this.comments = this.workshop.comments;
      })
    })
  }

  addWaiting() {
    this.serivce.addWaiting(this.workshop.idW, this.user.email).subscribe((resp) => {
      this.msg = resp['message'];
      this.flag = true;
    })
  }
  addToNotify() {
    this.serivce.addToNotify(this.workshop.idW, this.user.email).subscribe((resp) => {
      this.msg = resp['message'];
      this.flag = true;
    })
  }

  cancel() {
    this.serivce.cancelWorksh(this.workshop.idW).subscribe((resp) => {
      this.serivce.getById(this.workshop.idW).subscribe((data : Workshops) => {
        this.workshop = data;
        if(this.workshop.status != 'active' || new Date(this.workshop.date) < new Date(Date.now())) this.flag = false;
      })
    })
  }

  update() {
    this.changes = JSON.parse(JSON.stringify(this.workshop));
    if(this.changes.gallery.at(0) != null) this.photo1 = this.changes.gallery.at(0);
    if(this.changes.gallery.at(1) != null) this.photo2 = this.changes.gallery.at(1);
    if(this.changes.gallery.at(2) != null) this.photo3 = this.changes.gallery.at(2);
    if(this.changes.gallery.at(3) != null) this.photo4 = this.changes.gallery.at(3);
    if(this.changes.gallery.at(4) != null) this.photo5 = this.changes.gallery.at(4);
    this.updateInProgress = true;
  }

  remove(i) {
    switch(i) {
      case 0 : this.changes.mainPhoto = ""; break;
      case 1 : this.photo1 = ""; break;
      case 2 : this.photo2 = ""; break;
      case 3 : this.photo3 = ""; break;
      case 4 : this.photo4 = ""; break;
      case 5 : this.photo5 = ""; break;
    }
  }

  discard() {
    this.updateInProgress = false;
    window.location.reload();
  }

  decline(email) {
    this.serivce.clearNotify(this.workshop.idW, email).subscribe((resp) => {
      this.serivce.getById(this.workshop.idW).subscribe((data : Workshops) => {
        this.workshop = data;
      }
      )
    })
  }

  accept(email) {
    this.serivce.acceptUser(this.workshop.idW, email).subscribe((resp) => {
      this.serivce.getById(this.workshop.idW).subscribe((data : Workshops) => {
        this.workshop = data;
      }
      )
    })
  }

  updateWorksh() {
    let gallery = [];
    if(this.photo1 != "" && this.photo1 != null) gallery.push(this.photo1);
    if(this.photo2 != "" && this.photo2 != null) gallery.push(this.photo2);
    if(this.photo3 != "" && this.photo3 != null) gallery.push(this.photo3);
    if(this.photo4 != "" && this.photo4 != null) gallery.push(this.photo4);
    if(this.photo5 != "" && this.photo5 != null) gallery.push(this.photo5);
    this.changes.gallery = gallery;
    this.serivce.updateWorksh(this.changes.idW, this.changes.name, this.changes.date, this.changes.place, this.changes.shortDescr, this.changes.longDescr,
      this.changes.mainPhoto, this.changes.gallery).subscribe((resp => {
        window.location.reload();
      }))
  }

  photo1 : String = "";
  photo2 : String = "";
  photo3 : String = "";
  photo4 : String = "";
  photo5 : String = "";

  tmp : string = "";

  @ViewChild('fileUploadConvert') fileUploadConvert : ElementRef;

  getPhoto(event:Event, index) {
    this.msg = "";
    var image=new Image();
    const file=(event.target as HTMLInputElement).files[0];
    const allowedTypes=["image/png","image/jpeg","image/jpg"];
    if(file && allowedTypes.includes(file.type)){
      const reader = new FileReader();
      reader.onload=()=>{
        this.tmp = reader.result as string;
        image.src = this.tmp;    

        switch(index) {
          case 0: this.changes.mainPhoto = this.tmp; break;
          case 1: this.photo1 = this.tmp; break;
          case 2: this.photo2 = this.tmp; break;
          case 3: this.photo3 = this.tmp; break;
          case 4: this.photo4 = this.tmp; break;
          case 5: this.photo5 = this.tmp; break;
        }
      }
      reader.readAsDataURL(file);
    }
    
  }
}


