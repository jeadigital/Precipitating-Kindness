import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  constructor(private route: Router) { }

  ngOnInit() {
  }


  goToRegistration() {
    this.route.navigate(['registration']);
  }

  goToHome() {
    this.route.navigate(['home']);
  }

  goToLogin() {
    this.route.navigate(['login']);
  }
  
}
