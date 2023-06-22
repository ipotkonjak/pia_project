import { Component } from '@angular/core';
import { MainService } from './main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private main_service : MainService){
    this.logged = ( localStorage.getItem('user') != null);
    if(this.logged) {
      this.route = (JSON.parse(localStorage.getItem('user'))).type;
    }
    else {
      this.route = "";
    }
  }
  ngOnInit(): void {
    this.main_service.logged.subscribe((val : boolean)=>{
      this.logged = val;
      
      if(this.logged) {
        this.route = (JSON.parse(localStorage.getItem('user'))).type;
        
      }
      else {
        this.route = "";
      }

      //alert(this.route);
    });
  }

  logged : boolean = false;
  route : string = "";
  title = 'PIA Rocks';

  logout(){
    this.main_service.setLogged(false);
    localStorage.removeItem('user');
  }
}
