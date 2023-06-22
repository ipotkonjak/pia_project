import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http:HttpClient) { }

  uri:string= "http://localhost:4000/users";

  getAll() {
    return this.http.get(`${this.uri}/getAll`); 
  }

  checkData(username, email) {
    let data = {
      username : username,
      email : email
    }
    return this.http.post(`${this.uri}/checkData`,data);
  }

  checkEmail(email) {
    let data = {
      email : email
    }
    return this.http.post(`${this.uri}/checkEmail`,data);
  }

  register(username, password, firstname, lastname, email, tel, photo, type, orgName, orgAddress, orgNumber, status) {
    let data = {
      username : username,
      password : password,
      firstname : firstname,
      lastname : lastname,
      tel : tel,
      email : email,
      photo : photo ,
      type : type,
      orgName : orgName,
      orgAddress : orgAddress,
      orgNumber : orgNumber,
      status : status
    }
    return this.http.post(`${this.uri}/register`,data);
  }

  login(username, password) {
    let data = {
      username : username,
      password : password
    }
    return this.http.post(`${this.uri}/login`,data);
  }

  loginAdmin(username, password) {
    let data = {
      username : username,
      password : password
    }
    return this.http.post(`${this.uri}/loginAdmin`,data);
  }

  changePassword(email) {
    let data = {
      email : email
    }
    return this.http.post(`${this.uri}/changePassword`,data);
  }

  setPassword(username, password) {
    let data = {
      username : username,
      password : password
    }
    return this.http.post(`${this.uri}/setPassword`,data);
  }

  updateProfile(username, emailOld, firstname, lastname, email, tel, photo, type, orgName, orgAddress, orgNumber) {
    let data = {
      username : username,
      emailOld : emailOld,
      firstname : firstname,
      lastname : lastname,
      email : email,
      tel : tel,
      photo : photo,
      type : type,
      orgName : orgName,
      orgAddress : orgAddress,
      orgNumber : orgNumber
    }
    return this.http.post(`${this.uri}/updateProfile`,data);
  }

  rejectRequest(username) {
    let data = {
      username : username
    }
    return this.http.post(`${this.uri}/rejectRequest`,data);
  }

  acceptRequst(username) {
    let data = {
      username : username
    }
    return this.http.post(`${this.uri}/acceptRequst`,data);
  }

  deleteAccount(username) {
    let data = {
      username : username
    }
    return this.http.post(`${this.uri}/deleteAccount`,data);
  }
  
  getByUsername(username) {
    let data = {
      username : username
    }
    return this.http.post(`${this.uri}/getByUsername`,data);
  }

  upgradeUser(username) {
    let data = {
      username : username
    }
    return this.http.post(`${this.uri}/upgradeUser`,data);
  }
}
