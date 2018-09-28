import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class SurveyorhomeService {
  constructor(private http: HttpClient, private utilService: UtilService) {
    console.log("fellow user");

  }

  getSurveyor() {
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'surveyor/all_house_request/', {
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
    return this.http.post(UtilService.url + 'surveyor/update_house_request', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

  }
}
