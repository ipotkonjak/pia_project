import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import Users from '../models/users';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private service : UsersService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'));
  }

  user : Users;
  oldPass : string;
  newPass : string;
  confirm : string;
  msg : string;

  change() {
    if(this.oldPass != this.user.password) {
      this.msg = "Pogresan unos stare lozinke";
      return;
    }

    if (this.newPass.length < 8 || this.newPass.length > 16 || !/^[a-zA-Z]/.test(this.newPass) || !/[A-Z]/.test(this.newPass) ||
        !/[0-9]/.test(this.newPass) || !/[@|\\|!|,|\.|\/|*|+]/.test(this.newPass)) {
      this.msg = "Pogresan format lozinke!";
      return;
    }

    if(this.newPass != this.confirm) {
      this.msg = "Razlikuju se lozinka i potvrda";
      return;
    }

    this.service.setPassword(this.user.username, this.newPass).subscribe((resp) => {
      this.msg = resp['message'];
      this.main_service.setLogged(false);
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })    
  }
}
