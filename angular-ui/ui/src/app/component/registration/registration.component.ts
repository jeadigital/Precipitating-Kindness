import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'util';
import { AppComponent } from '../../app.component';
import { RegisterService } from './register.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  constructor(private obj: FormBuilder, private http: HttpClient,
    private registerService: RegisterService, private modalService: NgbModal) {

  }
  values: any = [];
  respns: any = {};
  display: string = "";
  dataFromServer: any = [];
  data: any = [];
  roleChange: string;
  closeResult: string;
  sampleform = new FormGroup({

    email: new FormControl(),
    role: new FormControl(),
    name: new FormControl(),
    phone: new FormControl(),
    password: new FormControl(),

  })

  ngOnInit() {
    //console.log(this.dataService.userData);

    //this.dataService.list().subscribe(data => { this.values = data });
  }

  roleChanged(role) {
    console.log("the radio button selected is" + role);
    this.roleChange = role;
  }
  open(content) {
    this.modalService.open(content,{size:'lg'}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

}
