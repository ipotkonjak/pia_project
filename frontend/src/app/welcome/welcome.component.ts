import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private service : WorkshopsService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.service.getAll("", "").subscribe((data: Workshops[]) => {
      this.workshops = JSON.parse(JSON.stringify(data)).filter(e => new Date(e.date).getTime() >= new Date(Date.now()).getTime() );
      this.topFive = data.filter(e => new Date(e.date).getTime() >= new Date(Date.now()).getTime() ).sort((a,b) => b.likes.length - a.likes.length).slice(0, 5);
    })
  }

  workshops : Workshops[];
  topFive : Workshops[];

  details(idW) {
    this.router.navigate(['details', idW]);
  }

  name: string = "";
  place : string = "";
  sorting : string = "";
  user : Users = null;

  search() {
    this.service.getAll(this.name, this.place).subscribe((data : Workshops[]) => {
      this.workshops = data.filter(e => new Date(e.date).getTime() >= new Date(Date.now()).getTime());
      this.sorting = "";
    })
  }

  nameSort(){
    this.workshops.sort((a,b)=>a.name.localeCompare(b.name));
  }
  dateSort(){
    this.workshops.sort((a,b)=> new Date(a.date).getTime()- new Date(b.date).getTime());
  }

  sortWorkshops() {
    switch(this.sorting) {
      case "name" : this.nameSort(); break;
      case "date" : this.dateSort(); break;
    }
  }
}
