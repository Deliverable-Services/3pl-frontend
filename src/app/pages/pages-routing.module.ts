import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { InventoryListComponent } from "./business/inventory/inventory-list/inventory-list.component";
import { InventoryOnlineComponent } from "./business/inventory/inventory-online/inventory-online.component";
// import { NotFoundComponent } from './abnormal/not-found/not-found.component';

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },

      {
        path: "product",
        loadChildren: () =>
          import("./product/product.module").then((m) => m.ProductModule),
      },
      {
        path: "business",
        loadChildren: () =>
          import("./business/business.module").then((m) => m.BusinessModule),
      },
      {
        path: "operation",
        loadChildren: () =>
          import("./operation/operation.module").then((m) => m.OperationModule),
      },
      {
        path: "credit-terms",
        loadChildren: () =>
          import("./credit-terms/credit-terms.module").then((m) => m.CreditTermsModule),
      },
      {
        path: "connection-location",
        loadChildren: () =>
          import("./connection-location/connection-location.module").then((m) => m.ConnectionLocationModule),
      },
      {
        path: "user-management",
        loadChildren: () =>
          import("./user-management/user-management.module").then((m) => m.UserManagementModule),
      },
      {
        path: "inventory",
        component: InventoryListComponent,
      },
      {
        path: "inventory-online",
        component: InventoryOnlineComponent,
      },
      {
        path: "",
        redirectTo: "",
        pathMatch: "full",
      },
      {
        path: "user-management",
        loadChildren: () =>
          import("./connection-location/connection-location.module").then((m) => m.ConnectionLocationModule),
      },
      // {
      //   path: '**',
      //   component: NotFoundComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
