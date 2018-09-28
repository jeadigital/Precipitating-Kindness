import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private route: Router, private obj: FormBuilder, private loginService: LoginService,
    private snotifyService: SnotifyService, private loader: NgxSpinnerService) {

    this.createform();
    this.createloginform();
  }
  loginData: any = [];
  loginClicked: boolean = true;
  values: any = [];
  respns: any = {};
  display: string = "";
  message: string = "";
  dataFromServer: any = [];
  data: any = [];
  roleChange: string;
  sucess: string = "";
  ress: string = "";
  respnse: string = "";
  respn: string = "";

  sampleform = new FormGroup({

    email: new FormControl(),
    role: new FormControl(),
    mobile: new FormControl(),
    aadhar: new FormControl(),
    password: new FormControl(),

  })



  roleChanged1(role) {
    console.log("the radio button selected is" + role);
    this.roleChange = role;
    console.log(this.roleChange);
  }



  userRegister() {
    this.data = [];
    // console.log(this.sampleform.value);

    //console.log(this.sampleform.value);
    this.loader.show();
    var args = { "args": this.data }
    this.data.push(this.roleChange);
    this.data.push(this.sampleform.value.email);
    var args = { "args": this.data };
    console.log("aadhar" + this.sampleform.value.aadhar);
    console.log("mobile" + this.sampleform.value.mobile);
    if (this.sampleform.value.aadhar && this.sampleform.value.mobile) {
      this.data.push(this.sampleform.value.mobile);
      this.data.push(this.sampleform.value.aadhar);
    }
    this.data.push(this.sampleform.value.password);

    this.loginService.submitser(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);
        this.loader.hide();

        console.log(res['message']);
        this.respnse = (res['message']);
        this.sampleform.reset()
       

      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide();

      }
    );


  }



  loginform = new FormGroup({

    email: new FormControl(),
    password: new FormControl(),
    role: new FormControl(),

  });
  msg() {


    if (this.respnse) {
      return true;
    }
    else {
      return false;
    }

  }

  msg2() {


    if (this.respn) {
      return true;
    }
    else {
      return false;
    }

  }
  roleChanged(role) {
    console.log("the radio button selected is" + role);
    this.roleChange = role;

  }
  clickLogin(type) {
    if (type == 1) {
      this.loginClicked = true;
    } else if (type == 2) {
      this.loginClicked = false;

    }
  }

  login() {
    console.log(this.loginform.value);
    this.loginData = [];

    this.loader.show();

    console.log(this.roleChange);
    this.loginData.push(this.loginform.value.email);
    this.loginData.push(this.loginform.value.password);
    this.loginData.push(this.roleChange);

    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);

    sessionStorage.clear();
    this.loginService.authenticate(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);
        this.loader.hide();
        this.respn = (res['message']);
        /*
  var ress=res.message;
  console.log(ress);
  this.message=ress;

   var rst=res.token;
   console.log(rst);
   */

        sessionStorage.setItem("token", (res['token']));

        sessionStorage.setItem("User", (res['User']));
        sessionStorage.setItem("role", (res['role']));

        var status = res['success'];

        var category = res['role'];
        //var status = true;
        console.log("Status" + status);




        if (status == true && category == "HouseOwner") {
          console.log("Status-----------" + status);
          this.route.navigate(['houseownerhome']);
        } else if (status == true && category == "Planner") {
          console.log("planners page")
          console.log("Status-----------" + status);
          this.route.navigate(['plannerhouserequestlisting']);

        } else if (status == true && category == "Surveyor") {
          console.log("Surveyors page")
          console.log("Status-----------" + status);
          this.route.navigate(['surveyorhome']);
        }
        else if (status == true && category == "Architect") {
          console.log("Architect page")
          console.log("Status-----------" + status);
          this.route.navigate(['architectplanrequest']);
        }
        else if (status == true && category == "ConstructionCompany") {
          console.log("Construction page")
          console.log("Status-----------" + status);
          this.route.navigate(['constructionhome']);
        }

        else {

        }

      }




      ,
      err => {
        console.log("second");
        this.loader.hide();
       
      })

  }


  createform() {
    //validation

    this.sampleform = this.obj.group({


      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.compose([Validators.required])],
      mobile: ["", Validators.compose([Validators.required])],
      aadhar: ["", Validators.compose([Validators.required])],

    });
  }


  createloginform() {
    //validation

    this.loginform = this.obj.group({


      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.compose([Validators.required])],


    });
  }








}
