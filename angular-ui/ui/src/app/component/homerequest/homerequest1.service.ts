
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class Homerequest1Service {


  constructor(private http: HttpClient, private utilService: UtilService) {
    console.log("fellow user");
  }

  submitser(payload) {
    console.log(payload)
    console.log("welome register");
    var token = "";
    //token = UtilService.token;
    token = sessionStorage.getItem("token");
    return this.http.post(UtilService.url + 'new_house_request', payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });


  }


}