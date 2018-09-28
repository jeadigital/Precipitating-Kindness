import { Component, OnInit } from '@angular/core';
import { HouserequestlistforplanapprovalService } from './houserequestlistforplanapproval.service';
import { Router } from '@angular/router';
import { UtilService } from '../../util/util';
@Component({
  selector: 'app-houserequestlistforplanapproval',
  templateUrl: './houserequestlistforplanapproval.component.html',
  styleUrls: ['./houserequestlistforplanapproval.component.css']
})
export class HouserequestlistforplanapprovalComponent implements OnInit {
  values: any = [];
  constructor(private utilService: UtilService, private houserequestlistforplanapproval: HouserequestlistforplanapprovalService, private route: Router) { }
  statusvalue: boolean = false;
  ngOnInit() {
    this.houserequestlistforplanapproval.getViewlist().subscribe(
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

  acceptrejectalllist(houserequestid) {
    this.utilService.sethouserequestid(houserequestid);
    this.route.navigate(['getallaccrejhouserequest'])
  }

  completedHouselist() {
    this.route.navigate(['completedhouse'])
  }
  bidRequest() {
    this.route.navigate(['bidrequestplanner'])
  }
  logout() {
    sessionStorage.clear();
    this.route.navigate(['authoritylogin']);

  }
}
