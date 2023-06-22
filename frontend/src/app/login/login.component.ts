import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service : UsersService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
  }

  username : string = "";
  password : string = "";
  msg : string = "";

  login() {
    this.msg = "";
    if(this.username == "" || this.password == "") {
      this.msg = "Uneti kredencijale!";
      return;
    }

    this.service.login(this.username, this.password).subscribe((resp) => {
      if(resp.hasOwnProperty('message')) this.msg = resp['message'];
      else {
       
        localStorage.setItem('user', JSON.stringify(resp));
        this.main_service.setLogged(true);
        this.router.navigate(['']);
      }
    })
  }
}
