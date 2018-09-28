import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class CompletedhouseService {

  constructor(private http: HttpClient, private utilService: UtilService) {
  }
  getList() {
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'completed_house_list', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

}
