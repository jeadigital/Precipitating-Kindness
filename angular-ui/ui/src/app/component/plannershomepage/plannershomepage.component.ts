import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-plannershomepage',
  templateUrl: './plannershomepage.component.html',
  styleUrls: ['./plannershomepage.component.css']
})
export class PlannershomepageComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  houserequestlist() {
    this.route.navigate(['plannerhouserequestlisting']);
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
    this.route.navigate(['login']);

  }

}
