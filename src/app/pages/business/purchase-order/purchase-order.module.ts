import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseOrderRoutingModule } from "./purchase-order-routing.module";
import { FormsModule } from "@angular/forms";
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";
import { AdminFormModule } from "src/app/@shared/components/admin-form";
import { SharedModule } from "src/app/@shared/shared.module";
import { PurchaseOrderListComponent } from "./purchase-order-list/purchase-order-list.component";
import { PurchaseOrderFormComponent } from "./purchase-order-form/purchase-order-form.component";
import { PurchaseOrderFormModalComponent } from "./purchase-order-form-modal/purchase-order-form-modal.component";
import { PurchaseOrderShipmentsModalComponent } from "./purchase-order-shipments-modal/purchase-order-shipments-modal.component";

@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderFormComponent,
    PurchaseOrderFormModalComponent,
    PurchaseOrderShipmentsModalComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
  ],
})
export class PurchaseOrderModule {}
