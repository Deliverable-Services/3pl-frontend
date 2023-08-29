import { NgModule } from "@angular/core";
import { DialogService, 
  BackTopModule,
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule, } from "ng-devui";
import { SharedModule } from "../@shared/shared.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { DaLayoutModule } from "../@shared/layouts/da-layout";
import { InventoryListComponent } from "./business/inventory/inventory-list/inventory-list.component";
import { MyDatePipe } from "../@shared/pipe/date-pipe.pipe";

@NgModule({
  imports: [
    PagesRoutingModule, 
    BackTopModule, 
    SharedModule, 
    DaLayoutModule,
    PaginationModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule],
  declarations: [
    PagesComponent,
    InventoryListComponent
  ],
  providers: [DialogService],
})
export class PagesModule {}
