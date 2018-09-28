import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ListofhouserequestforbidapprovalService {


  constructor(private http: HttpClient, private utilService: UtilService) {
    console.log("fellow user");

  }
  getViewlist() {
    var user = "";
    user = sessionStorage.getItem("User");
    var token = "";
    token = sessionStorage.getItem("token");
    var houserequestid = "";
    houserequestid = this.utilService.gethouserequestid();
    return this.http.get(UtilService.url + 'all_new_bid_request_for_planner', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }
}
