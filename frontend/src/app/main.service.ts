import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor() { }

  private _logged = new Subject<boolean>();
  get logged() : Observable<boolean>{
    return this._logged.asObservable();
  }
  setLogged(l : boolean){
    this._logged.next(l);
  }

}
