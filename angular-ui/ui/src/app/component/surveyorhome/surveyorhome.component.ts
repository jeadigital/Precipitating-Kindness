import { Component, OnInit } from '@angular/core';
import { SurveyorhomeService } from './surveyorhome.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'app-surveyorhome',
  templateUrl: './surveyorhome.component.html',
  styleUrls: ['./surveyorhome.component.css']
})
export class SurveyorhomeComponent implements OnInit {

  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService, private surveyorhomeService: SurveyorhomeService, private modalService: NgbModal, private route: Router) { }
  values: any = [];
  data: any = [];
  closeResult: string;
  roleChange: string;
  currentRequest = {};
  modalReference: NgbModalRef;
  ngOnInit() {
    this.surveyorhomeService.getSurveyor().subscribe(
      res => {
        console.log("ist");
        console.log(res);
        { this.values = res }
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }

  modalform = new FormGroup({

    email: new FormControl(),

    comments: new FormControl(),
    plotarea: new FormControl(),
    constructionarea: new FormControl()

  })
  roleChanged1(role) {
    console.log("the radio button selected is" + role);
    this.roleChange = role;
    console.log(this.roleChange);
  }
  userAccept() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.loader.show();

    this.data.push(this.currentRequest['HouseRequestID']);

    this.data.push("SurveyCompleted");
    var args = { "args": this.data }

    this.data.push("false");
    this.data.push(this.modalform.value.plotarea);
    this.data.push(this.modalform.value.constructionarea);
    this.surveyorhomeService.submitser(args).subscribe(
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
        this.loader.hide();

      }
    );

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


  logout() {
    sessionStorage.clear();
    this.route.navigate(['authoritylogin']);

  }
}




