import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class BidrequestplannerService {

  constructor(private http: HttpClient, private utilService: UtilService) {
  }
  getList() {
    var token = "";
    token = sessionStorage.getItem("token");
    var houserequestid = "";
    houserequestid = this.utilService.gethouserequestid();
    return this.http.get(UtilService.url + 'get_all_bids_against_a_houseRequest/' + houserequestid, {
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
    return this.http.post(UtilService.url + 'approve_bid', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

  }
}
