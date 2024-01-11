import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";

import { SharedModule } from "src/app/@shared/shared.module";
import { ShippingAddressRoutingModule } from './shipping-address-routing.module';
import { ShippingAddressFormComponent } from './shipping-address-form/shipping-address-form.component';
import { ShippingAddressListComponent } from './shipping-address-list/shipping-address-list.component';


@NgModule({
  declarations: [
    ShippingAddressFormComponent,
    ShippingAddressListComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ShippingAddressRoutingModule,
    PaginationModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule
  ]
})
export class ShippingAddressModule { }
