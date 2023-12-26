import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InvoiceManagementRoutingModule } from "./invoice-management-routing.module";
import { FormsModule } from "@angular/forms";
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";
import { AdminFormModule } from "src/app/@shared/components/admin-form";
import { SharedModule } from "src/app/@shared/shared.module";
import { InvoiceManagementListComponent } from "./invoice-management-list/purchase-order-list.component";
import { InvoiceManagementFormComponent } from "./invoice-management-form/invoice-management-form.component";
import { InvoiceManagementFormModalComponent } from "./invoice-management-form-modal/invoice-management-form-modal.component";

@NgModule({
  declarations: [
    InvoiceManagementListComponent,
    InvoiceManagementFormComponent,
    InvoiceManagementFormModalComponent
  ],
  imports: [
    CommonModule,
    InvoiceManagementRoutingModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
  ],
})
export class InvoiceManagementModule {}
