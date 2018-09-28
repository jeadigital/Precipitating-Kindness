import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions,Headers } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class ArchitectplanrequestService {
  constructor(private http:HttpClient, private utilService: UtilService) {
    console.log("fellow user"); }
 
    builderplan() {
      console.log(+UtilService.User)
      return this.http.get(UtilService.url+'list_all/'+UtilService.User, {headers:{
      'Content-Type': 'application/json',
       Authorization: 'Bearer ' + UtilService.token
    }});
    }


    submitser(payload) {
      var token ="";
      token = sessionStorage.getItem("token");
      console.log(payload)
      console.log("welome register");
      return this.http.post(UtilService.url+'builder/submit_new_house_plan', payload,{headers:{
        'Content-Type': 'application/json',
         Authorization: 'Bearer ' + token
       }})
  
    }
}
