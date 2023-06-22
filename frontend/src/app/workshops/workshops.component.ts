import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {

  constructor(private service : WorkshopsService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.service.getForUserActive(this.user.email).subscribe((data : Workshops[]) => {
      this.workshops = data;
    })
  }

  workshops : Workshops[] = [];
  user : Users;
  msg : string;
  date : Date = new Date(Date.now());

  sorting : string = "";

  nameSort(){
    this.workshops.sort((a,b)=>a.name.localeCompare(b.name));
  }
  dateSort(){
    this.workshops.sort((a,b)=> new Date(a.date).getTime()- new Date(b.date).getTime());
  }
  placeSort(){
    this.workshops.sort((a,b)=> a.place.localeCompare(b.place));
  }
  descrSort(){
    this.workshops.sort((a,b)=> a.shortDescr.localeCompare(b.shortDescr));
  }


  sortWorkshops() {
    switch(this.sorting) {
      case "name" : this.nameSort(); break;
      case "date" : this.dateSort(); break;
      case "place" : this.placeSort(); break;
      case "descr" : this.descrSort(); break;
    }
  }
  compare(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    return ((date1.getTime() - date2.getTime()) / 3600000) > 12;
  } 

  clear(idW) {
    this.service.clearNotify(idW, this.user.email).subscribe((resp) => {
      this.msg = resp['message'];
      this.service.getForUserActive(this.user.email).subscribe((data : Workshops[]) => {
        this.workshops = data;
      })
    })
  }
}
