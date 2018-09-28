import { Component, OnInit } from '@angular/core';
import { ConstructionhomeService } from './constructionhome.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilService } from '../../util/util';
import { NgxSpinnerService } from 'ngx-spinner';

import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'app-constructionhome',
  templateUrl: './constructionhome.component.html',
  styleUrls: ['./constructionhome.component.css']
})
export class ConstructionhomeComponent implements OnInit {
  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);

  }
  modalReference: NgbModalRef;
  
  values: any = [];
  data: any = [];
  closeResult: string;
  currentRequest = {};
  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService, private route: Router, private constructionhome: ConstructionhomeService, private modalService: NgbModal) { }



  goToRegistration() {
    this.route.navigate(['listallapprovedplans']);
  }
  goToHome() {
    this.route.navigate([' constructionhome']);
  }


  ngOnInit() {


    this.constructionhome.getList().subscribe(
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


    HouseRequestID: new FormControl(),
    BidAmount: new FormControl(),
    time: new FormControl()

  })

  

  userAccept() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.loader.show();
    var user = "";
    user = sessionStorage.getItem("User");
    this.data.push(user);

    this.data.push(this.currentRequest['HouseRequestID']);

    this.data.push(this.modalform.value.BidAmount);
    var args = { "args": this.data }

    this.data.push(this.modalform.value.time);

    this.constructionhome.submitser(args).subscribe(
      res => {

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

}
