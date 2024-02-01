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
import { PurchaseOrderEditQtyModalComponent } from "./purchase-order-edit-qty-modal/purchase-order-edit-qty-modal.component";
import { SplitAllocationModalComponent } from "./split-allocation-modal/split-allocation-modal.component";
import { LinkedInvoiceModalComponent } from "./linked-invoice-modal/linked-invoice-modal.component";

@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderFormComponent,
    PurchaseOrderFormModalComponent,
    PurchaseOrderShipmentsModalComponent,
    PurchaseOrderEditQtyModalComponent,
    SplitAllocationModalComponent,
    LinkedInvoiceModalComponent
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
