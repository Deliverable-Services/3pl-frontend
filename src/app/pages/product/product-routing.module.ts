import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { BrandListComponent } from "./brand/brandList/brand-list.component";
import { BrandFormComponent } from "./brand/brand-form/brand-form.component";
import { MonitorComponent } from "../dashboard/monitor/monitor.component";
import { CategoryListComponent } from "./category/categoryList/category-list.component";
import { CategoryFormComponent } from "./category/category-form/category-form.component";
import { MaterialListComponent } from "./material/materialList/material-list.component";
import { MaterialFormComponent } from "./material/material-form/material-form.component";
import { UnitListComponent } from "./unit/unitList/unit-list.component";
import { ProductListComponent } from "./product/productList/product-list.component";
import { ProductFormComponent } from "./product/product-form/product-form.component";
import { ProductsListComponent } from "./products/products-list/products-list.component";
import { ProductsFormComponent } from "./products/products-form/products-form.component";
import { UnitFormComponent } from "./unit/unit-form/unit-form.component";

const routes: Routes = [
  {
    path: "brand",
    component: BrandListComponent,
  },
  {
    path: "brand/add",
    component: BrandFormComponent,
  },
  {
    path: "brand/edit/:id",
    component: BrandFormComponent,
  },
  {
    path: "category",
    component: CategoryListComponent,
  },

  {
    path: "category/add",
    component: CategoryFormComponent,
  },
  {
    path: "category/edit/:id",
    component: CategoryFormComponent,
  },
  {
    path: "material",
    component: MaterialListComponent,
  },

  {
    path: "material/add",
    component: MaterialFormComponent,
  },
  {
    path: "material/edit/:id",
    component: MaterialFormComponent,
  },
  {
    path: "unit",
    component: UnitListComponent,
  },
  {
    path: "unit/add",
    component: UnitFormComponent,
  },
  {
    path: "unit/edit/:id",
    component: UnitFormComponent,
  },
  {
    path: "product",
    component: ProductListComponent,
  },

  {
    path: "product/add",
    component: ProductFormComponent,
  },
  {
    path: "product/edit/:id",
    component: ProductFormComponent,
  },
  {
    path: "products",
    component: ProductsListComponent,
  },

  {
    path: "products/add",
    component: ProductsFormComponent,
  },
  {
    path: "products/edit/:id",
    component: ProductsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
