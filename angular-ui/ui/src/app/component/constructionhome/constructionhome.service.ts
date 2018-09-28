import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions,Headers } from '@angular/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ConstructionhomeService {

  constructor(private http:HttpClient, private utilService: UtilService,private route: Router) { }
  getList() {
    var user ="";
    user = sessionStorage.getItem("User");
    var token ="";
    token = sessionStorage.getItem("token");
    console.log(user +token)
    return this.http.get(UtilService.url+'list_all_approved_plans/'+user, {headers:{
    'Content-Type': 'application/json',
     Authorization: 'Bearer ' + token
  }});
  }
  logout()
  {
    sessionStorage.clear();
    this.route.navigate(['login']);
  
  }

  submitser(payload) {
    var token ="";
    token = sessionStorage.getItem("token");
    console.log(payload)
    console.log("welome register");
    return this.http.post(UtilService.url+'submit_new_bid', payload,{headers:{
      'Content-Type': 'application/json',
       Authorization: 'Bearer ' + token
     }})

  }
}
