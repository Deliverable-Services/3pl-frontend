import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ShipmentAndShippingListComponent } from "./shipment-and-shipping-list/shipment-and-shipping-list.component";
import { ShipmentAndShippingFormComponent } from "./shipment-and-shipping-form/shipment-and-shipping-form.component";

const routes: Routes = [
  {
    path: "",
    component: ShipmentAndShippingListComponent,
  },
  {
    path: "add",
    component: ShipmentAndShippingFormComponent,
  },
  {
    path: "edit/:id",
    component: ShipmentAndShippingFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmentAndShippingRoutingModule {}
