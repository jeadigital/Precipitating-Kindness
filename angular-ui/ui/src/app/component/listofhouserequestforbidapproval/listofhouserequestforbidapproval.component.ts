import { Component, OnInit } from '@angular/core';
import { ListofhouserequestforbidapprovalService } from './listofhouserequestforbidapproval.service';
import { Router } from '@angular/router';
import { UtilService } from '../../util/util';
@Component({
  selector: 'app-listofhouserequestforbidapproval',
  templateUrl: './listofhouserequestforbidapproval.component.html',
  styleUrls: ['./listofhouserequestforbidapproval.component.css']
})
export class ListofhouserequestforbidapprovalComponent implements OnInit {

  constructor(private utilService: UtilService, private listofhouserequestforbidapproval: ListofhouserequestforbidapprovalService, private route: Router) { }
  values: any = [];
  ngOnInit() {
    this.listofhouserequestforbidapproval.getViewlist().subscribe(
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
  logout() {
    sessionStorage.clear();
    this.route.navigate(['authoritylogin']);

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

  acceptrejectalllist(houserequestid) {
    this.utilService.sethouserequestid(houserequestid);
    this.route.navigate(['getallaccrejhouserequest'])
  }

  completedHouselist() {
    this.route.navigate(['completedhouse'])
  }
  bidRequest(houserequestid) {
    this.utilService.sethouserequestid(houserequestid);

    this.route.navigate(['bidrequestplanner'])
  }
}
