import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrandListComponent } from "./brand/brandList/brand-list.component";
import { ProductRoutingModule } from "./product-routing.module";
import { FormsModule } from "@angular/forms";
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";
import { AdminFormModule } from "src/app/@shared/components/admin-form";
import { SharedModule } from "src/app/@shared/shared.module";
import { BrandFormComponent } from "./brand/brand-form/brand-form.component";
import { CategoryFormComponent } from "./category/category-form/category-form.component";
import { CategoryListComponent } from "./category/categoryList/category-list.component";
import { MaterialListComponent } from "./material/materialList/material-list.component";
import { MaterialFormComponent } from "./material/material-form/material-form.component";
import { UnitListComponent } from "./unit/unitList/unit-list.component";
import { ProductListComponent } from "./product/productList/product-list.component";
import { ProductFormComponent } from "./product/product-form/product-form.component";
import { StyleListComponent } from "./style/styleList/style-list.component";
import { StyleFormComponent } from "./style/style-form/style-form.component";
import { MyDatePipe } from "src/app/@shared/pipe/date-pipe.pipe";
import { UnitFormComponent } from "./unit/unit-form/unit-form.component";
import { ToggleModule } from 'ng-devui/toggle';
import { StyleSelectModelComponent } from './product/style-select-model/style-select-model.component';
import { CurrencyExchangeComponent } from './currency-exchange/currency-exchange.component';

@NgModule({
  declarations: [
    BrandListComponent,
    BrandFormComponent,
    CategoryFormComponent,
    CategoryListComponent,
    MaterialListComponent,
    MaterialFormComponent,
    UnitListComponent,
    UnitFormComponent,
    ProductListComponent,
    ProductFormComponent,
    StyleListComponent,
    StyleFormComponent,
    StyleSelectModelComponent,
    CurrencyExchangeComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
    ToggleModule
  ],
})
export class ProductModule {}
