import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
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
        path: "",
        redirectTo: "",
        pathMatch: "full",
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
