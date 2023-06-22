import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private service : UsersService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
  }

  email : string = "";
  msg : string = "";

  changePassword() {
    this.service.changePassword(this.email).subscribe((resp) => {
      this.msg = resp['message'];
    })
  }
}
