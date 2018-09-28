import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlannerhouserequestlistingService {


  constructor(private http: HttpClient, private utilService: UtilService, private route: Router) { }




  getList() {
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'get_new_house_request', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }
  submitser(payload) {
    var token = "";
    token = sessionStorage.getItem("token");
    console.log(payload)
    console.log("welome register");
    return this.http.post(UtilService.url + 'update_house_request', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);

  }
  houserequestlist() {
    this.route.navigate(['plannerhouserequestlisting']);
  }

  houserequeststatus() {
    this.route.navigate(['plannerrequeststatus']);
  }

  acceptrejectalllist() {
    this.route.navigate(['getallaccrejhouserequest'])
  }


}
