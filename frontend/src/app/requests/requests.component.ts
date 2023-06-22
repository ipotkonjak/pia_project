import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { UsersService } from '../users.service';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private service : WorkshopsService, private service_user : UsersService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
    this.service.getAllAdmin().subscribe((data : Workshops[]) => {
      this.workshopsAccepted = data.filter(e => e.status == "active");
      this.workshopsWaiting = data.filter(e => e.status == "waiting");


      this.workshopsWaiting.forEach(element => {
        this.service_user.getByUsername(element.organizer).subscribe((user : Users)=> {
          if(user.type == 'participant') {
            this.service.getForUserActive(user.email).subscribe((worksh : Workshops[]) => {
              // alert(JSON.stringify(worksh));
              element.allow = worksh.length == 0;
            })
          }
          else element.allow = true;
        })
      });
    })

    this.service_user.getAll().subscribe((data : Users[]) => {
      
      this.usersWaiting = data.filter(e => e.status == 'waiting');
      this.usersAccepted = JSON.parse(JSON.stringify(data)).filter(e => e.status == 'active' && e.type != 'admin');
      
    })
  }

  workshopsAccepted : Workshops[];
  workshopsWaiting : Workshops[];
  usersAccepted : Users[];
  usersWaiting : Users[];

  chosen : string = "users";


  openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    // document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
   closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
  }
  choose(c) {
    this.chosen = c;
  }

  acceptUser(username) {
    this.service_user.acceptRequst(username).subscribe((resp) => {
      window.location.reload();
    })
  }

  rejectUser(username) {
    this.service_user.rejectRequest(username).subscribe((resp) => {
      window.location.reload();
    })
  }

  deleteUser(username) {
    this.service_user.getByUsername(username).subscribe((user : Users) => {
      this.service.getForUserActive(user.email).subscribe((worksh : Workshops[]) => {
        worksh.forEach(element => {
          this.service.clearNotify(element.idW, user.email).subscribe();
        });
        this.service_user.deleteAccount(username).subscribe((resp) => {
          window.location.reload();
        })
      })
    })
    
  }

  acceptWorkshop(idW, organizer) {
    let org = this.usersAccepted.find(e => e.username == organizer);
    // alert(org);
    if(org.type == 'participant') {
      this.service_user.upgradeUser(org.username).subscribe((resp) => {

      })
    }
    this.service.acceptRequst(idW).subscribe((resp) => {
      window.location.reload();
    })
  }

  rejectWorkshop(idW) {
    this.service.rejectRequest(idW).subscribe((resp) => {
      window.location.reload();
    })
  }

  deleteWorkshop(idW) {
    this.service.deleteWorkshop(idW).subscribe((resp) => {
      window.location.reload();
    })
  }

  changeUser(username) {
    this.router.navigate(['update/user', username]);
  }

  changeWorkshop(idW) {
    this.router.navigate(['update/workshop', idW]);
  }

  addWorkshop() {
    this.router.navigate(['addworksh']);
  }

  addUser() {
    this.router.navigate(['register']);
  }
}
