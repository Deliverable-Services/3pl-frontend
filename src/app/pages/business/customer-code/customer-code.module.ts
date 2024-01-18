import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";

import { SharedModule } from "src/app/@shared/shared.module";
import { CustomerCodeRoutingModule } from './customer-code-routing.module';
import { CustomerCodeFormComponent } from './customer-code-form/customer-code-form.component';
import { CustomerCodeListComponent } from './customer-code-list/customer-code-list.component';


@NgModule({
  declarations: [
    CustomerCodeFormComponent,
    CustomerCodeListComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CustomerCodeRoutingModule,
    PaginationModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule
  ]
})
export class CustomerCodeModule { }
