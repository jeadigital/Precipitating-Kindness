import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-houseownerhome',
  templateUrl: './houseownerhome.component.html',
  styleUrls: ['./houseownerhome.component.css']
})
export class HouseownerhomeComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  goToHomerequest() {
    this.route.navigate(['homerequest']);
  }
  goToHomestatus() {
    this.route.navigate(['viewstatus']);
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);

  }


}