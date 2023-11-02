import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ShipmentAndShippingRoutingModule } from "./shipment-and-shipping-routing.module";
import { FormsModule } from "@angular/forms";
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";
import { AdminFormModule } from "src/app/@shared/components/admin-form";
import { SharedModule } from "src/app/@shared/shared.module";
import { ShipmentAndShippingListComponent } from "./shipment-and-shipping-list/shipment-and-shipping-list.component";
import { ShipmentAndShippingFormComponent } from "./shipment-and-shipping-form/shipment-and-shipping-form.component";
import { ShipmentAndShippingFormModalComponent } from "./shipment-and-shipping-form-modal/shipment-and-shipping-form-modal.component";
import { PackagesFormModalComponent } from "./packages-form-modal/packages-form-modal.component";
import { BulkPackFormModalComponent } from "./bulk-pack-form-modal/bulk-pack-form-modal.component";

@NgModule({
  declarations: [
    ShipmentAndShippingListComponent,
    ShipmentAndShippingFormComponent,
    ShipmentAndShippingFormModalComponent,
    PackagesFormModalComponent,
    BulkPackFormModalComponent
  ],
  imports: [
    CommonModule,
    ShipmentAndShippingRoutingModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
  ],
})
export class ShipmentAndShippingModule {}
