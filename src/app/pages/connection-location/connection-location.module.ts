import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";

import { SharedModule } from "src/app/@shared/shared.module";

import { ConnectionLocationRoutingModule } from './connection-location-routing.module';
import { ConnectionLocationFormComponent } from './connection-location-form/connection-location-form.component';
import { ConnectionLocationListComponent } from './connection-location-list/connection-location-list.component';


@NgModule({
  declarations: [
    ConnectionLocationFormComponent,
    ConnectionLocationListComponent
  ],
  imports: [
    CommonModule,
    ConnectionLocationRoutingModule,
    PaginationModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
    SharedModule
  ]
})
export class ConnectionLocationModule { }
