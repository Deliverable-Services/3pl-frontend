import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";

import { SharedModule } from "src/app/@shared/shared.module";
import { CreditTermsRoutingModule } from './credit-terms-routing.module';
import { CreditTermsFormComponent } from './credit-terms-form/credit-terms-form.component';
import { CreditTermsListComponent } from './credit-terms-list/credit-terms-list.component';


@NgModule({
  declarations: [
    CreditTermsFormComponent,
    CreditTermsListComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CreditTermsRoutingModule,
    PaginationModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule
  ]
})
export class CreditTermsModule { }
