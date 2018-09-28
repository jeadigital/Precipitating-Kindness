import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PlannerrequeststatusService } from './plannerrequeststatus.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { UtilService } from '../../util/util'
@Component({
  selector: 'app-plannerrequeststatus',
  templateUrl: './plannerrequeststatus.component.html',
  styleUrls: ['./plannerrequeststatus.component.css']
})
export class PlannerrequeststatusComponent implements OnInit {
  data: any = [];
  roleChange: string;
  values: any = [];
  closeResult: string;
  currentRequest = {};
  modalReference: NgbModalRef;
  statusvalue: boolean = false;

  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService, private plannerrequeststatusService: PlannerrequeststatusService, private route: Router, private modalService: NgbModal) { }
  logout() {
    sessionStorage.clear();
    this.route.navigate(['authoritylogin']);

  }


  sampleform = new FormGroup({

    hemail: new FormControl(),
    aemail: new FormControl()
  })

  ngOnInit() {
    this.plannerrequeststatusService.getList().subscribe(
      res => {
        console.log("ist");

        console.log(res);
        if (this.values.length!=0) {
          console.log("123");
          this.statusvalue = true;
          console.log(this.statusvalue);
        }

        {
        this.values = res

          console.log(res);
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
    email1: new FormControl(),
    amount: new FormControl()
  })
  userAccept() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.loader.show();
    this.data.push(this.currentRequest['HouseRequestID']);
    this.data.push(this.currentRequest['ApprovedBidConstructionCompany']);

    var args = { "args": this.data }

    this.data.push(this.roleChange);
    this.data.push(this.modalform.value.amount);
    this.plannerrequeststatusService.submitser(args).subscribe(
      res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>" + this.roleChange);
        console.log("first..");
        console.log(res);
        this.modalReference.close();
        for (var i = 0; i < this.values.length; i++) {
          if (this.values[i].HouseRequestID == this.currentRequest['HouseRequestID']) {
            this.values.splice(i, 1);
            this.loader.hide();
          }
        }



      },
      err => {
        console.log("second");
        console.log(err);
        this.loader.hide();
      }
    );

  }
  listuserrequestbidapproval() {
    this.route.navigate(['listofhouserequestforbidapproval'])
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






