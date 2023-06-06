import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";
import { OperationRoutingModule } from "./operation-routing.module";
import { PurchaseOrderFormComponent } from "./purchase-order/purchase-order-form/purchase-order-form.component";
import { PurchaseOrderListComponent } from "./purchase-order/purchase-order-list/purchase-order-list.component";
import { SharedModule } from "src/app/@shared/shared.module";
import { AdminFormModule } from "src/app/@shared/components/admin-form";
import { ShipmentFormComponent } from "./shipment/shipment-form/shipment-form.component";
import { ShipmentListComponent } from "./shipment/shipment-list/shipment-list.component";
import { PackageFormComponent } from "./shipment/package-form/package-form.component";
import { PurchaseOrderLineFormComponent } from "./purchase-order/purchase-order-line-form/purchase-order-line-form.component";
import { ShipmentDetailFormComponent } from "./purchase-order/shipment-detail-form/shipment-detail-form.component";

@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderFormComponent,
    ShipmentFormComponent,
    ShipmentListComponent,
    ShipmentDetailFormComponent,
    PackageFormComponent,
    PurchaseOrderLineFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
    OperationRoutingModule,
  ],
})
export class OperationModule {}
