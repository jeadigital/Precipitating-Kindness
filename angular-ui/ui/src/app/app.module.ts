import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { LoginComponent } from './component/login/login.component';
import { routes } from './app.routing';
import {HttpClientModule}from'@angular/common/http';
import { RegisterService  } from './component/registration/register.service';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginService  } from './component/login/login.service';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import { UtilService } from './util/util';
import { HomerequestComponent } from './component/homerequest/homerequest.component';
import{ Homerequest1Service} from './component/homerequest/homerequest1.service';
import { PlannershomepageComponent} from  './component/plannershomepage/plannershomepage.component';
import { PlannerhouserequestlistingComponent } from './component/plannerhouserequestlisting/plannerhouserequestlisting.component';
import { PlannerrequeststatusComponent } from './component/plannerrequeststatus/plannerrequeststatus.component';
import{PlannerhouserequestlistingService} from './component/plannerhouserequestlisting/plannerhouserequestlisting.service';
import { HouseownerhomeComponent } from './component/houseownerhome/houseownerhome.component';
import { ViewstatusComponent } from './component/viewstatus/viewstatus.component';
import{ViewstatusService} from './component/viewstatus/viewstatus.service';
import { SurveyorhomeComponent } from './component/surveyorhome/surveyorhome.component';
import {SurveyorhomeService  } from    './component/surveyorhome/surveyorhome.service';
import { ArchitectplanrequestComponent } from './component/architectplanrequest/architectplanrequest.component';
import {ArchitectplanrequestService} from './component/architectplanrequest/architectplanrequest.service';
import{ PlannerrequeststatusService} from './component/plannerrequeststatus/plannerrequeststatus.service';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalBasic } from './component/registration/modal';
import { GetallaccrejhouserequestComponent } from './component/getallaccrejhouserequest/getallaccrejhouserequest.component';
import {GetallaccrejhouserequestService } from './component/getallaccrejhouserequest/getallaccrejhouserequest.service';
import { ConstructionhomeComponent } from './component/constructionhome/constructionhome.component';
import {ConstructionhomeService} from './component/constructionhome/constructionhome.service';
import { ListallapprovedplansComponent } from './component/listallapprovedplans/listallapprovedplans.component';
import {ListallapprovedplansService }from './component/listallapprovedplans/listallapprovedplans.service';
import { CompletedhouseComponent } from './component/completedhouse/completedhouse.component';
import {CompletedhouseService}  from './component/completedhouse/completedhouse.service';
import { BidrequestplannerComponent } from './component/bidrequestplanner/bidrequestplanner.component';
import{ HouserequestlistforplanapprovalService} from './component/houserequestlistforplanapproval/houserequestlistforplanapproval.service';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HouserequestlistforplanapprovalComponent } from './component/houserequestlistforplanapproval/houserequestlistforplanapproval.component';
import { ListofhouserequestforbidapprovalComponent } from './component/listofhouserequestforbidapproval/listofhouserequestforbidapproval.component';
import{ListofhouserequestforbidapprovalService} from './component/listofhouserequestforbidapproval/listofhouserequestforbidapproval.service';
import { AuthorityloginComponent } from './component/authoritylogin/authoritylogin.component';
import{AuthorityloginService} from'./component/authoritylogin/authoritylogin.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistrationComponent,
    LoginComponent,

  
    HomerequestComponent,
    PlannershomepageComponent,
    PlannerhouserequestlistingComponent,
    PlannerrequeststatusComponent,
    HouseownerhomeComponent,
    ViewstatusComponent,
    SurveyorhomeComponent,
    ArchitectplanrequestComponent,
    NgbdModalBasic,
    GetallaccrejhouserequestComponent,
    ConstructionhomeComponent,
    ListallapprovedplansComponent,
    CompletedhouseComponent,
    BidrequestplannerComponent,
   
    HouserequestlistforplanapprovalComponent,
    ListofhouserequestforbidapprovalComponent,
    AuthorityloginComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RouterModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,SnotifyModule,
    NgbModule.forRoot(),
    NgxSpinnerModule

  ],
  exports: [ SnotifyModule],

  providers: [ListofhouserequestforbidapprovalService, RegisterService,PlannerrequeststatusService,ArchitectplanrequestService,GetallaccrejhouserequestService ,
    SurveyorhomeService,LoginService,ViewstatusService,UtilService,ConstructionhomeService,
    PlannerhouserequestlistingService,{ provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService, AuthorityloginService,NgbActiveModal,ListallapprovedplansService,CompletedhouseService,ListofhouserequestforbidapprovalService, HouserequestlistforplanapprovalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
