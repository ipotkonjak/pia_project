import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatsService } from '../chats.service';
import Chats from '../models/chats';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  constructor(private service : WorkshopsService, private router : Router, private service_chats : ChatsService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.service.getForOrganizer(this.user.username).subscribe((data : Workshops[]) => {
      this.workshops = data;
    })
  }

  user : Users;
  workshops : Workshops[] = [];
  chats : Chats[] = [];
  chosen : Workshops = null;
  toShow : Chats[] = [];


  selectWorksh(w) {
    this.chosen = w;
    this.toShow = [];
    this.service_chats.getAllOrganizer(this.chosen.idW).subscribe((data : Chats[]) => {
      this.chats = data;
    })
  } 

  showChat(c) {
    let flag = this.toShow.findIndex(e => e.workshop == c.workshop && e.participant == c.participant);
    if(flag == -1) {
      c.messages = c.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.toShow.push(c);
    }
  }

  closeChat(participant) {
    this.toShow = this.toShow.filter(e => e.participant != participant);

  }

  sendMessage(participant, message) {
    this.service_chats.sendMessage(participant, this.chosen.idW, this.user.username, new Date(Date.now()), message).subscribe((resp) => {
      this.service_chats.getOneChat(participant, this.chosen.idW).subscribe((data : Chats) => {
        data.messages = data.messages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let ind = this.chats.findIndex(e => e.workshop == data.workshop && e.participant == data.participant);
        this.chats.splice(ind, 1, data);
        ind = this.toShow.findIndex(e => e.workshop == data.workshop && e.participant == data.participant);
        this.toShow.splice(ind, 1, data);
      })
    }
    )
  }
}
