import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {
  constructor(private http:HttpClient) { }

  uri:string= "http://localhost:4000/workshops";

  getAllAdmin() {
    return this.http.get(`${this.uri}/getAllAdmin`);
  }
  getAll(name, place) {
    const data = {
      name : name,
      place : place
    }
    return this.http.post(`${this.uri}/getAll`, data);
  }

  getById(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/getById`, data);
  }

  insertWorksh(organizer, name, date, place, shortDescr, longDescr, mainPhoto, gallery, status, availableSpots) {
    const data = {
      organizer : organizer,
      name : name,
      date : date,
      place : place,
      shortDescr : shortDescr,
      longDescr : longDescr,
      mainPhoto : mainPhoto,
      gallery : gallery,
      status : status,
      availableSpots : availableSpots
    }
    return this.http.post(`${this.uri}/insertWorksh`, data);
  }

  addWaiting(idW, email) {
    const data = {
      idW : idW,
      email : email
    }
    return this.http.post(`${this.uri}/addWaiting`, data);
  }

  addToNotify(idW, email) {
    const data = {
      idW : idW,
      email : email
    }
    return this.http.post(`${this.uri}/addToNotify`, data);
  }

  getForUserActive(email) {
    const data = {
      email : email
    }
    return this.http.post(`${this.uri}/getForUserActive`, data);
  }

  getForUserOver(email) {
    const data = {
      email : email
    }
    return this.http.post(`${this.uri}/getForUserOver`, data);
  }

  clearNotify(idW, email) {
    const data = {
      idW : idW,
      email : email
    }
    return this.http.post(`${this.uri}/clearNotify`, data);
  }

  cancelWorksh(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/cancelWorksh`, data);
  }

  updateWorksh(idW, name, date, place, shortDescr, longDescr, mainPhoto, gallery) {
    const data = {
      idW : idW,
      name : name,
      date : date,
      place : place,
      shortDescr : shortDescr,
      longDescr : longDescr,
      mainPhoto : mainPhoto,
      gallery : gallery
    }
    return this.http.post(`${this.uri}/updateWorksh`, data);
  }

  acceptUser(idW, email) {
    const data = {
      idW : idW,
      email : email
    }
    return this.http.post(`${this.uri}/acceptUser`, data);
  }

  rejectRequest(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/rejectRequest`, data);
  }

  acceptRequst(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/acceptRequst`, data);
  }

  deleteWorkshop(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/deleteWorkshop`, data);
  }

  getLikesForUser(username) {
    const data = {
      username : username
    }
    return this.http.post(`${this.uri}/getLikesForUser`, data);
  }

  removeLikeForUser(username, idW) {
    const data = {
      username : username,
      idW : idW
    }
    return this.http.post(`${this.uri}/removeLikeForUser`, data);
  }

  getCommentsForUser(username) {
    const data = {
      username : username
    }
    return this.http.post(`${this.uri}/getCommentsForUser`, data);
  }

  removeCommentForUser(username, date) {
    const data = {
      username : username,
      date : date
    }
    return this.http.post(`${this.uri}/removeCommentForUser`, data);
  }

  editCommentForUser(username, date: Date, text) {
    const data = {
      username : username,
      date : date,
      text : text
    }
    return this.http.post(`${this.uri}/editCommentForUser`, data);
  }

  getAllLikes(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/getAllLikes`, data);
  }

  getAllComments(idW) {
    const data = {
      idW : idW
    }
    return this.http.post(`${this.uri}/getAllComments`, data);
  }

  addLike(idW, username) {
    const data = {
      idW : idW, 
      username : username
    }
    return this.http.post(`${this.uri}/addLike`, data);
  }

  addComment(idW, username, date : Date, text, photo) {
    let comment = {
      username : username,
      photo : photo,
      date : date,
      text : text
    }

    const data = {
      idW : idW, 
      comment : comment
    }
    return this.http.post(`${this.uri}/addComment`, data);
  }

  checkNameParticipant(name, email) {
    const data = {
      name : name, 
      email : email
    }

    return this.http.post(`${this.uri}/checkNameParticipant`, data);
  }

  getCoordinates(address : String) {
    let tokens = address.split(' ');
    let adr = tokens.at(0);
    for(let i = 1; i < tokens.length; i++) {
      adr = adr.concat("+",tokens.at(i));
    }
    let path = `https://nominatim.openstreetmap.org/search.php?q=${adr}&format=jsonv2`;
    return this.http.get(path);
  }

  getForOrganizer(username) {
    const data = {
      username : username
    }
    return this.http.post(`${this.uri}/getForOrganizer`, data);
  }
}
