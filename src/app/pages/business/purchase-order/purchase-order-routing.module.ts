import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PurchaseOrderListComponent } from "./purchase-order-list/purchase-order-list.component";
import { PurchaseOrderFormComponent } from "./purchase-order-form/purchase-order-form.component";

const routes: Routes = [
  {
    path: "",
    component: PurchaseOrderListComponent,
  },
  {
    path: "add",
    component: PurchaseOrderFormComponent,
  },
  {
    path: "edit/:id",
    component: PurchaseOrderFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}
