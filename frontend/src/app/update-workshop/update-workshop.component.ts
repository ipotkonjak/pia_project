import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Users from '../models/users';
import Workshops from '../models/workshops';
import { WorkshopsService } from '../workshops.service';

@Component({
  selector: 'app-update-workshop',
  templateUrl: './update-workshop.component.html',
  styleUrls: ['./update-workshop.component.css']
})
export class UpdateWorkshopComponent implements OnInit {

  constructor(private route : ActivatedRoute, private service : WorkshopsService, private router : Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    let idW =  parseInt(this.route.snapshot.paramMap.get('idW'));
    this.service.getById(idW).subscribe((worksh : Workshops) => {
      this.targetWorkshop = worksh;
      this.changes = JSON.parse(JSON.stringify(this.targetWorkshop));
    })
  }

  user : Users;
  targetWorkshop : Workshops;
  changes : Workshops;
  msg : string = "";

  updateWorksh() {
    let gallery = [];
    if(this.photo1 != "") gallery.push(this.photo1);
    if(this.photo2 != "") gallery.push(this.photo2);
    if(this.photo3 != "") gallery.push(this.photo3);
    if(this.photo4 != "") gallery.push(this.photo4);
    if(this.photo5 != "") gallery.push(this.photo5);
    this.changes.gallery = gallery;
    this.service.updateWorksh(this.changes.idW, this.changes.name, this.changes.date, this.changes.place, this.changes.shortDescr, this.changes.longDescr,
      this.changes.mainPhoto, this.changes.gallery).subscribe((resp => {
        this.targetWorkshop = this.changes;
        this.changes = JSON.parse(JSON.stringify(this.targetWorkshop));
      }))
  }

  photo1 : String = "";
  photo2 : String = "";
  photo3 : String = "";
  photo4 : String = "";
  photo5 : String = "";

  tmp : string = "";

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
          case 0: this.changes.mainPhoto = this.tmp; break;
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

  remove(i) {
    switch(i) {
      case 0 : this.changes.mainPhoto = ""; break;
      case 1 : this.photo1 = ""; break;
      case 2 : this.photo2 = ""; break;
      case 3 : this.photo3 = ""; break;
      case 4 : this.photo4 = ""; break;
      case 5 : this.photo5 = ""; break;
    }
  }
  discard() {
    this.router.navigate(['requests']);
  }

}
