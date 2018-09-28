import { Component, OnInit } from '@angular/core';
import { GetallaccrejhouserequestService } from './getallaccrejhouserequest.service';
import { Router } from '@angular/router';
import { UtilService } from '../../util/util'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'app-getallaccrejhouserequest',
  templateUrl: './getallaccrejhouserequest.component.html',
  styleUrls: ['./getallaccrejhouserequest.component.css']
})
export class GetallaccrejhouserequestComponent implements OnInit {
  values: any = [];
  currentRequest = {};
  roleChange: string;
  statusnew: string = "";
  data: any = [];
  closeResult: string;
  statusvalue: boolean = false;
  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService,  private route: Router, private getallaccrejhouserequest: GetallaccrejhouserequestService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getallaccrejhouserequest.getListservice().subscribe(
      res => {
        console.log("ist");
        console.log(res);

       
 
        if (this.values.length!=0) {
          console.log("123");
          this.statusvalue = true;
          console.log(this.statusvalue);
        }
    
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }
  modalform = new FormGroup({

    email: new FormControl(),

    email1: new FormControl()


  })
  roleChanged1(role) {
    console.log("the radio button selected is" + role);
    this.roleChange = role;
    console.log(this.roleChange);
  }
 
  userAccept() {
    this.data = [];
    this.loader.show();

    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");

    this.data.push(this.currentRequest['HouseRequestID']);
    this.data.push(this.currentRequest['ArchitectID']);
    var args = { "args": this.data }
    this.data.push("Accept");


    this.getallaccrejhouserequest.submitser(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);
        this.loader.hide();

      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide();

      }
    );

  }

  houserrequestplanapproval() {
    this.route.navigate(['houserequestlistforplanapproval']);
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
  listuserrequestbidapproval() {
    this.route.navigate(['listofhouserequestforbidapproval'])
  }


  userReject() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    this.loader.show();

    console.log("working");
    this.data.push(this.currentRequest['HouseRequestID']);
    this.data.push(this.currentRequest['ArchitectID']);


    var args = { "args": this.data }
    this.data.push("Reject");


    this.getallaccrejhouserequest.submitser(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);
        this.loader.hide();

      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide();


      }
    );

  }







  open(content, item) {
    console.log("------")
    console.log("----------", item);
    this.currentRequest = item;


    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);

  }


}
