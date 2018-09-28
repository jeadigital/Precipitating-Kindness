import { Component, OnInit } from '@angular/core';
import { ArchitectplanrequestService } from './architectplanrequest.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { UtilService } from '../../util/util'
@Component({
  selector: 'app-architectplanrequest',
  templateUrl: './architectplanrequest.component.html',
  styleUrls: ['./architectplanrequest.component.css']
})
export class ArchitectplanrequestComponent implements OnInit {
  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService, private architectplanrequestService: ArchitectplanrequestService, private route: Router, private modalService: NgbModal) { }
  values: any = [];
  closeResult: string;
  data: any = [];
  modalReference: NgbModalRef;
  currentRequest = {};
  


  ngOnInit() {
    this.architectplanrequestService.builderplan().subscribe(
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


    email1: new FormControl(),
    comment: new FormControl(),
    area: new FormControl(),
    members: new FormControl()



  })
  
  Upload() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.loader.show();
    var user = "";
    user = sessionStorage.getItem("User");
    this.data.push(user);
    this.data.push(this.currentRequest['HouseRequestID']);
    var args = { "args": this.data }
    this.data.push(this.modalform.value.comment);
    this.data.push(this.modalform.value.area);
    this.data.push(this.modalform.value.members);


    this.architectplanrequestService.submitser(args).subscribe(
      res => {

        console.log("first..");
        console.log(res);
        this.modalReference.close();
        for (var i = 0; i < this.values.length; i++) {
          if (this.values[i].HouseRequestID == this.currentRequest['HouseRequestID']) {
            this.values.splice(i, 1);
          }
        }
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
    this.route.navigate(['login']);

  }

}
