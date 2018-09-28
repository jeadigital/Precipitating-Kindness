import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions, Headers } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class PlannerrequeststatusService {
  constructor(private http: HttpClient, private utilService: UtilService) {
    console.log("fellow user");
  }

  getList() {
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'all_work_status', {
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
    return this.http.post(UtilService.url + 'payment', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

  }

}





