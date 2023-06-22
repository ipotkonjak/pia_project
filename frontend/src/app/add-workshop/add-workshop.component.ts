import { Time } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import Users from '../models/users';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-add-workshop',
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.css']
})
export class AddWorkshopComponent implements OnInit {

  constructor(private service : WorkshopsService, private router : Router, private main_service : MainService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  user : Users;

  name : string = "";
  date : Date = new Date(Date.now());
  time : string ;
  place : string = "";
  shortDescr : string = "";
  longDescr : string = "";
  mainPhoto : string = "";
  availableSpots : number = 0;
  gallery : Array<String> = [];
  photo1 : String = "";
  photo2 : String = "";
  photo3 : String = "";
  photo4 : String = "";
  photo5 : String = "";

  tmp : string = "";
  msg : string = "";

  remove(i) {
    switch(i) {
      case 0: this.mainPhoto = ""; break;
      case 1: this.photo1 = ""; break;
      case 2: this.photo2 = ""; break;
      case 3: this.photo3 = ""; break;
      case 4: this.photo4 = ""; break;
      case 5: this.photo5 = ""; break;
    }
  }

  @ViewChild('fileUploadConvert') fileUploadConvert : ElementRef;

  getPhoto(event:Event, index) {
    this.msg = "";
    var image=new Image();
    const file=(event.target as HTMLInputElement).files[0];
    const allowedTypes=["image/png","image/jpeg","image/jpg"];
    if(file && allowedTypes.includes(file.type)){
      const reader = new FileReader();
      reader.onload=()=>{
        this.tmp = reader.result as string;
        image.src = this.tmp;    

        switch(index) {
          case 0: this.mainPhoto = this.tmp; break;
          case 1: this.photo1 = this.tmp; break;
          case 2: this.photo2 = this.tmp; break;
          case 3: this.photo3 = this.tmp; break;
          case 4: this.photo4 = this.tmp; break;
          case 5: this.photo5 = this.tmp; break;
        }
      }
      reader.readAsDataURL(file);
    }
    
  }

  add() {
    
    if(this.name == "" || this.place == "" || this.shortDescr == "" || this.mainPhoto == "") {
      
      this.msg = "Uneti potrebne podatke";
      return
    }
    this.gallery = [];
    if(this.photo1 != "" && this.photo1 != null) this.gallery.push(this.photo1);
    if(this.photo2 != "" && this.photo2 != null) this.gallery.push(this.photo2);
    if(this.photo3 != "" && this.photo3 != null) this.gallery.push(this.photo3);
    if(this.photo4 != "" && this.photo4 != null) this.gallery.push(this.photo4);
    if(this.photo5 != "" && this.photo5 != null) this.gallery.push(this.photo5);
    let status = (this.user.type == 'admin' ? 'active' : 'waiting');

    let t = this.time.split(":", 2);
    let d = new Date(this.date);
    d.setHours(Number(t[0]));
    d.setMinutes(Number(t[1]));
    this.date = d;
    this.service.insertWorksh(this.user.username, this.name, this.date, this.place, this.shortDescr, this.longDescr,
      this.mainPhoto, this.gallery, status, this.availableSpots).subscribe((resp) => {
        this.msg = resp['message'];
      })
  }

  jsonTemplate : File;
  getTemplate(event) {
    this.jsonTemplate = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.jsonTemplate, "UTF-8");
    fileReader.onload = () => {
     let json = JSON.parse(fileReader.result.toString());
     this.name = json['name']
     this.date = (json['date'].toString()).substring(0,10)     
     this.place = json['place']
     this.shortDescr = json['shortDescr']
     this.longDescr = json['longDescr']
     this.mainPhoto = json['mainPhoto']
     this.availableSpots = json['availableSpots']
     this.gallery = json['gallery']
     
     if(this.gallery.at(0) != null) this.photo1 = this.gallery.at(0);
     if(this.gallery.at(1) != null) this.photo2 = this.gallery.at(1);
     if(this.gallery.at(2) != null) this.photo3 = this.gallery.at(2);
     if(this.gallery.at(3) != null) this.photo4 = this.gallery.at(3);
     if(this.gallery.at(4) != null) this.photo5 = this.gallery.at(4);
    }
    fileReader.onerror = (err) => {
      console.log(err);
    }
  }
}

