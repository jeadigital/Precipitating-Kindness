import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions,Headers } from '@angular/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class GetallaccrejhouserequestService {
  constructor(private http:HttpClient, private utilService: UtilService,private route: Router) { }
  getListservice() {
    var user ="";
    user = sessionStorage.getItem("User");
    var token ="";
    token = sessionStorage.getItem("token");
    var houserequestid ="";
    houserequestid = this.utilService.gethouserequestid();
    return this.http.get(UtilService.url+'get_all_plans/'+houserequestid, {headers:{
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
    return this.http.post(UtilService.url+'approve_house_plan', payload,{headers:{
      'Content-Type': 'application/json',
       Authorization: 'Bearer ' + token
     }})

  }
}
