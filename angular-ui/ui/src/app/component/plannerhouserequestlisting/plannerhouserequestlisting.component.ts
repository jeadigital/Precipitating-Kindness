import { Component, OnInit } from '@angular/core';
import { PlannerhouserequestlistingService } from './plannerhouserequestlisting.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'app-plannerhouserequestlisting',
  templateUrl: './plannerhouserequestlisting.component.html',
  styleUrls: ['./plannerhouserequestlisting.component.css']
})
export class PlannerhouserequestlistingComponent implements OnInit {

  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService, private route: Router, private listingService: PlannerhouserequestlistingService, private modalService: NgbModal) { }
  values: any = [];
  closeResult: string;
  roleChange: string;
  statusnew: string = "";
  data: any = [];
  currentRequest = {};
  modaldisplay: string;
  statusvalue: boolean = false;
  modalmsg: string;
  modalReference: NgbModalRef;
  logout() {
    sessionStorage.clear();
    this.route.navigate(['authoritylogin']);

  }
  ngOnInit() {
    this.listingService.getList().subscribe(
      res => {
        console.log("ist");

        console.log(res);
        {
        this.values = res
          this.statusnew = this.values.HouseRequestID
          console.log("<><<>" + this.values);
        }
        console.log("sss"+this.values+"ee");

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


  roleChanged1(role) {
    console.log("the radio button selected is" + role);
    this.roleChange = role;
    console.log(this.roleChange);
  }



  modalform = new FormGroup({

    email: new FormControl(),

    comments: new FormControl()


  })
  userAccept() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    this.loader.show();

    console.log("working");
    console.log(this.statusnew);
    this.data.push(this.currentRequest['HouseRequestID']);
    var args = { "args": this.data }
    this.data.push("Accept");
    this.data.push(this.modalform.value.comments);

    this.listingService.submitser(args).subscribe(
      res => {

        this.modalmsg = res['success'];
        this.loader.hide();
        if (res['success'] == true) {
          this.statusnew = "updates completed...";
          this.modalReference.close();
          for (var i = 0; i < this.values.length; i++) {
            if (this.values[i].HouseRequestID == this.currentRequest['HouseRequestID']) {
              this.values.splice(i, 1);
            }
          }

        }
      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide()
      }
    );

  }
  listuserrequestbidapproval() {
    this.route.navigate(['listofhouserequestforbidapproval'])
  }
  houserequestlist() {
    this.route.navigate(['plannerhouserequestlisting']);
  }
  houserrequestplanapproval() {
    this.route.navigate(['houserequestlistforplanapproval']);
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
  returnvalue() {

    console.log("test");
    if (this.statusvalue == true) {
      return true;
    }
    else {
      return false;
    }
  }

  returnvalueflase() {
    console.log("test");

    if (this.statusvalue == false) {
      console.log(this.statusvalue);
      return true;
    }
    else {
      return false;
    }
  }

  modal() {


    if (this.modalmsg) {
      return true;
    }
    else {
      return false;
    }

  }


  userReject() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.loader.show();
    this.data.push(this.currentRequest['HouseRequestID']);
    var args = { "args": this.data }
    this.data.push("Reject");
    this.data.push(this.modalform.value.comments);

    this.listingService.submitser(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);

        this.modalReference.close();
        for (var i = 0; i < this.values.length; i++) {
          if (this.values[i].HouseRequestID == this.currentRequest['HouseRequestID']) {
            this.values.splice(i, 1);
            this.loader.hide()
          }
        }
      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide()
      }
    );

  }


  msg() {


    if (this.statusnew) {
      return true;
    }
    else {
      return false;
    }

  }




  open(content, item) {
    console.log("----------", item);
    this.currentRequest = item;

    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
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


}
