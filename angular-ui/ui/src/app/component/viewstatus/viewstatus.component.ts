import { Component, OnInit } from '@angular/core';
import { ViewstatusService } from './viewstatus.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-viewstatus',
  templateUrl: './viewstatus.component.html',
  styleUrls: ['./viewstatus.component.css']
})
export class ViewstatusComponent implements OnInit {

  constructor(private viewstatus: ViewstatusService, private route: Router) { }
  values: any = [];
  statusnew: string = "";
  updatedstatus: string = "";
  statusvalue: boolean = false;
  data: any = [];
  ConstructionCompletedAndVerified: boolean = false;
  wrkstatus: string = "";

  ngOnInit() {
    this.statusHouseowner()

  }


  statusHouseowner() {
    this.viewstatus.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log(res);





        if (res['Status']) {
          this.wrkstatus = res['Status'];
        }
        if (res['Status']) {
          this.ConstructionCompletedAndVerified = res['ConstructionCompletedAndVerified'];
        }


        if (res['Status'] == "New") {
          this.statusnew = "Application is under processing";
        }
        if (res['Status'] != "New") {
          this.statusnew = res['Status']
        }

        if (res['Status']) {
          this.statusvalue = true;
        }

        { this.values = res }
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }



  userUpdate() {

    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.data = [];
    var User = "";
    User = sessionStorage.getItem("User");
    this.data.push(User);
    var args = { "args": this.data }


    this.viewstatus.submitser(args).subscribe(
      res => {

        console.log(res);

      },
      err => {
        console.log("second");
        console.log(err);


      }
    );

  }




  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);

  }

  msg() {


    if (this.statusnew) {
      return true;
    }
    else {
      return false;
    }

  }
  goToHomestatus() {
    this.route.navigate(['houseownerhome']);
  }
  goToHomerequest() {
    this.route.navigate(['homerequest']);
  }
  returnvalue() {


    if (this.statusvalue == true) {
      return true;
    }
    else {
      return false;
    }
  }

  returnvalueflase() {


    if (this.statusvalue == false) {
      return true;
    }
    else {
      return false;
    }
  }




  statusbuttonhide() {


    console.log(this.wrkstatus);

    if (this.wrkstatus == "Third Phase Completed" && this.ConstructionCompletedAndVerified == false) {



      console.log(this.wrkstatus);


      return true;

    }
    else {

      return false;
    }
  }


}