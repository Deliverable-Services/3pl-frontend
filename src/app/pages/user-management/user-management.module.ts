import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";

import { SharedModule } from "src/app/@shared/shared.module";
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    UserFormComponent,
    UserListComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    UserManagementRoutingModule,
    PaginationModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule
  ]
})
export class UserManagementModule { }
