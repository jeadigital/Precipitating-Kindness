import { Component, OnInit } from '@angular/core';
import { CompletedhouseService } from './completedhouse.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completedhouse',
  templateUrl: './completedhouse.component.html',
  styleUrls: ['./completedhouse.component.css']
})
export class CompletedhouseComponent implements OnInit {

  constructor(private completedhouse: CompletedhouseService, private route: Router) { }
  values: any = [];
  
  ngOnInit() {

    this.completedhouse.getList().subscribe(
      res => {
        console.log("ist");
        console.log(res);
       
        this.values = res

      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }
  

  houserequestlist() {
    this.route.navigate(['plannerhouserequestlisting']);
  }

  listuserrequestbidapproval() {
    this.route.navigate(['listofhouserequestforbidapproval'])
  }
  houserequeststatus() {
    this.route.navigate(['plannerrequeststatus']);
  }

  acceptrejectalllist() {
    this.route.navigate(['getallaccrejhouserequest'])
  }

  completedHouselist() {
    this.route.navigate(['completedhouse'])
  }
  bidRequest() {
    this.route.navigate(['bidrequestplanner'])
  }
  logout() {
    sessionStorage.clear();
    this.route.navigate(['authoritylogin']);

  }
  houserrequestplanapproval() {
    this.route.navigate(['houserequestlistforplanapproval']);
  }

}
