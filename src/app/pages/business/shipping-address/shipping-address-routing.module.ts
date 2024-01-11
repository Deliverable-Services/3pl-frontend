import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingAddressListComponent } from './shipping-address-list/shipping-address-list.component';
import { ShippingAddressFormComponent } from './shipping-address-form/shipping-address-form.component';

const routes: Routes = [
  {
    path: "",
    component: ShippingAddressListComponent,
  },
  {
    path: "add",
    component: ShippingAddressFormComponent,
  },
  {
    path: "edit/:id",
    component: ShippingAddressFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingAddressRoutingModule { }
