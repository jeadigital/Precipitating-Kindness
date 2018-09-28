import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilService } from '../../util/util'


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {
    console.log("fellow user");

  }


    dataFromServer: any = [];
    public userData: any = [];
    res: any = {};


    submitser(payload) {
      console.log(payload);
      console.log("welome");
      return this.http.post(UtilService.url+'register', payload);

    }

  }
