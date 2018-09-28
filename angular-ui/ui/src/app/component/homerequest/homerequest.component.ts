import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup , Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Homerequest1Service } from './homerequest1.service';
import { UtilService } from '../../util/util';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'app-homerequest',
  templateUrl: './homerequest.component.html',
  styleUrls: ['./homerequest.component.css']
})
export class HomerequestComponent implements OnInit {
  data: any = [];
  displaymsg: string;
  roleChange: string;
  status: string;
  sample: boolean = false;
  token = UtilService.token;

  constructor(private homerequestService: Homerequest1Service,private obj: FormBuilder, private route: Router, private snotifyService: SnotifyService, private loader: NgxSpinnerService) { }

  sampleform = new FormGroup({


    location: new FormControl(),
    damagedetails: new FormControl(),
    propertyid: new FormControl(),
    housenumber: new FormControl(),
    village: new FormControl(),
    district: new FormControl()

  })


  ngOnInit() {
    this.createform();

  }
  goToHomestatus() {
    this.route.navigate(['houseownerhome']);
  }
  goToviewstatus() {
    this.route.navigate(['viewstatus']);
  }

  userRegister() {
    this.data = [];


    this.loader.show();
    var sample: boolean;
    var args = { "args": this.data }
    var user = "";
    user = sessionStorage.getItem("User");

    this.data.push(user);
    this.data.push(this.sampleform.value.location);
    this.data.push(this.sampleform.value.damagedetails);
    this.data.push(this.sampleform.value.propertyid);
    this.data.push(this.sampleform.value.housenumber);
    this.data.push(this.sampleform.value.village);
    this.data.push(this.sampleform.value.district);

    this.homerequestService.submitser(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);
        this.loader.hide();

        this.status = (res['resp']);
        this.sampleform.reset();


      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide();

      }
    );

  }
  msg2() {
    if (this.status) {
      return true;
    }
    else {
      return false;
    }
  }
  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);

  }
  msg() {
    if (this.status) {
      this.sample = false;
      return this.sample;
    }
    else {
      this.sample = true;
      return this.sample;
    }

  }



  createform() {
    //validation

    this.sampleform = this.obj.group({


      location: ["", [Validators.required]],
      damagedetails:["",[Validators.required]],
      propertyid:["",[Validators.required]],
      housenumber:["",[Validators.required]],
      village:["",Validators.required],
      district:["",Validators.required]
    });
  }

}