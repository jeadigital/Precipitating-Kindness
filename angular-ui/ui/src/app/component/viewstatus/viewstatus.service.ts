
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ViewstatusService {


  constructor(private http: HttpClient, private utilService: UtilService) {
    console.log("fellow user");

  }

  getViewstatus() {
    var user = "";
    user = sessionStorage.getItem("User");
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'get_house_request_status/' + user, {
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
    return this.http.post(UtilService.url + 'user_updation', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

  }


}