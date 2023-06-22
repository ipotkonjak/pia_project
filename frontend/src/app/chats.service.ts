import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  constructor(private http:HttpClient) { }

  uri:string= "http://localhost:4000/chats";

  getAllOrganizer(workshop) {
    const data = {
      workshop : workshop
    }
    return this.http.post(`${this.uri}/getAllOrganizer`, data); 
  }

  getAllParticipant(participant) {
    const data = {
      participant : participant
    }
    return this.http.post(`${this.uri}/getAllParticipant`, data); 
  }

  getOneChat(participant, workshop) {
    const data = {
      participant : participant,
      workshop : workshop
    }
    return this.http.post(`${this.uri}/getOneChat`, data); 
  }

  startChat(participant, workshop, chatPhoto, sender, date, text, participantPhoto) {
    let message = {
      sender : sender,
      date : date,
      text : text
    }
    const data = {
      participant : participant,
      participantPhoto : participantPhoto,
      workshop : workshop,
      message : message,
      chatPhoto : chatPhoto
    }
    return this.http.post(`${this.uri}/startChat`, data); 
  }

  sendMessage(participant, workshop, sender, date, text) {
    let message = {
      sender : sender,
      date : date,
      text : text
    }
    const data = {
      participant : participant,
      workshop : workshop,
      message : message
    }
    return this.http.post(`${this.uri}/sendMessage`, data); 
  }
}
