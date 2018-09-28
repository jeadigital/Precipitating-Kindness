import { Component, OnInit } from '@angular/core';
import { BidrequestplannerService } from './bidrequestplanner.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'app-bidrequestplanner',
  templateUrl: './bidrequestplanner.component.html',
  styleUrls: ['./bidrequestplanner.component.css']
})
export class BidrequestplannerComponent implements OnInit {

  constructor(private snotifyService: SnotifyService, private loader: NgxSpinnerService,  private bidrequestplanner: BidrequestplannerService, private route: Router, private modalService: NgbModal) { }
  values: any = [];
  closeResult: string;
  currentRequest = {};
  data: any = [];
  
  ngOnInit() {
    this.bidrequestplanner.getList().subscribe(
      res => {
        console.log("ist");
        console.log(res);
        this.values = res
        
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
  userAccept() {
    this.data = [];
    // console.log(this.sampleform.value);
    //console.log(this.sampleform.value);
    console.log("working");
    this.loader.show();

    this.data.push(this.currentRequest['BidRequestID']);
    var args = { "args": this.data }
    this.data.push("Accept");
    this.data.push(this.currentRequest['HouseRequestID']);

    this.bidrequestplanner.submitser(args).subscribe(
      res => {

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
    console.log("working");
    this.loader.show();

    this.data.push(this.currentRequest['BidRequestID']);
    var args = { "args": this.data }
    this.data.push("Accept");
    this.data.push(this.currentRequest['HouseRequestID']);

    this.bidrequestplanner.submitser(args).subscribe(
      res => {

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
