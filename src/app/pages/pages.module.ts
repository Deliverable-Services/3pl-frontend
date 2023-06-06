import { NgModule } from "@angular/core";
import { DialogService, BackTopModule } from "ng-devui";
import { SharedModule } from "../@shared/shared.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { DaLayoutModule } from "../@shared/layouts/da-layout";
import { MyDatePipe } from "../@shared/pipe/date-pipe.pipe";

@NgModule({
  imports: [PagesRoutingModule, BackTopModule, SharedModule, DaLayoutModule],
  declarations: [PagesComponent],
  providers: [DialogService],
})
export class PagesModule {}
