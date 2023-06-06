import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PurchaseOrderListComponent } from "./purchase-order/purchase-order-list/purchase-order-list.component";
import { PurchaseOrderFormComponent } from "./purchase-order/purchase-order-form/purchase-order-form.component";
import { ShipmentListComponent } from "./shipment/shipment-list/shipment-list.component";
import { ShipmentFormComponent } from "./shipment/shipment-form/shipment-form.component";
import { PackageFormComponent } from "./shipment/package-form/package-form.component";

const routes: Routes = [
  {
    path: "purchase-order",
    component: PurchaseOrderListComponent,
  },
  {
    path: "purchase-order/add",
    component: PurchaseOrderFormComponent,
  },
  {
    path: "purchase-order/edit/:id",
    component: PurchaseOrderFormComponent,
  },
  {
    path: "shipment",
    component: ShipmentListComponent,
  },
  {
    path: "shipment/add",
    component: ShipmentFormComponent,
  },
  {
    path: "shipment/package/add/:id",
    component: PackageFormComponent,
  },
  {
    path: "shipment/edit/:id",
    component: ShipmentFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
