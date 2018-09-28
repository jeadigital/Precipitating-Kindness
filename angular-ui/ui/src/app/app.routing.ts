import {  Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './component/registration/registration.component';
import{ HomeComponent } from './component/home/home.component';
import{ LoginComponent } from './component/login/login.component';
import { HomerequestComponent } from './component/homerequest/homerequest.component'
import { PlannershomepageComponent} from  './component/plannershomepage/plannershomepage.component';
import { PlannerhouserequestlistingComponent } from './component/plannerhouserequestlisting/plannerhouserequestlisting.component';
import { PlannerrequeststatusComponent } from './component/plannerrequeststatus/plannerrequeststatus.component';
import { HouseownerhomeComponent } from './component/houseownerhome/houseownerhome.component';
import { ViewstatusComponent } from './component/viewstatus/viewstatus.component';
import { SurveyorhomeComponent } from './component/surveyorhome/surveyorhome.component';
import { ArchitectplanrequestComponent } from './component/architectplanrequest/architectplanrequest.component';
import { GetallaccrejhouserequestComponent } from './component/getallaccrejhouserequest/getallaccrejhouserequest.component';
import { ConstructionhomeComponent } from './component/constructionhome/constructionhome.component';
import { ListallapprovedplansComponent } from './component/listallapprovedplans/listallapprovedplans.component';
import { CompletedhouseComponent } from './component/completedhouse/completedhouse.component';
import { BidrequestplannerComponent } from './component/bidrequestplanner/bidrequestplanner.component';
import { HouserequestlistforplanapprovalComponent } from './component/houserequestlistforplanapproval/houserequestlistforplanapproval.component';
import { ListofhouserequestforbidapprovalComponent } from './component/listofhouserequestforbidapproval/listofhouserequestforbidapproval.component';
import { AuthorityloginComponent } from './component/authoritylogin/authoritylogin.component';
import { Component } from '@angular/core';

export const routes: Routes = [
 
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {
    path:'authoritylogin',
    component:AuthorityloginComponent

  },
  {
    path:'listofhouserequestforbidapproval',
    component:ListofhouserequestforbidapprovalComponent
  },

  {path:'login',component:LoginComponent},
   {
      path: 'registration',
      component: RegistrationComponent
    },
{
  path:'houserequestlistforplanapproval' ,
  component:HouserequestlistforplanapprovalComponent
},
   
    {
      path:'homerequest',
      component:HomerequestComponent
    },
    {
      path:'plannershomepage',
      component:PlannershomepageComponent
    },
    {
      path:'plannerhouserequestlisting',
      component:PlannerhouserequestlistingComponent
    },
     
  {
    path:'plannerrequeststatus',
    component:PlannerrequeststatusComponent
  },
  {
    path:'houseownerhome',
    component:HouseownerhomeComponent
  },
  {
    path:'viewstatus',
    component:ViewstatusComponent
  },
  {
    path:'surveyorhome',
    component:SurveyorhomeComponent
  },
  {
    path:'architectplanrequest',
    component:ArchitectplanrequestComponent
  },
  {path : 'home', 
   component : HomeComponent
   },
   {
    path:'getallaccrejhouserequest',
    component :  GetallaccrejhouserequestComponent
   },
   {
     path:'constructionhome',
     component:ConstructionhomeComponent
   },
   {
    path:'listallapprovedplans',
    component: ListallapprovedplansComponent
  },
  {
    path:'completedhouse',
    component:CompletedhouseComponent
  },
{
  path:'bidrequestplanner',
  component:BidrequestplannerComponent

}
  ]
