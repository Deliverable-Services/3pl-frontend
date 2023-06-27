import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { ShopifyConnectorService } from 'src/app/@core/mock/shopify-connector.service';
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-currency-form',
  templateUrl: './shopify-connector-form.component.html',
  styleUrls: ['./shopify-connector-form.component.scss']
})
export class ShopifyConnectorFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    connectorName: "",
    baseUrl: "",
    token: ""
  };
  paramId: string = "";
  selectedCreditTerms: any = {};
  constructor(
    private shopifyConnectorService: ShopifyConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getById(this.paramId);
    }
  }

  getById(id: string) {
    this.shopifyConnectorService.getById(id).subscribe((res) => {
      console.log({ res });
      this.selectedCreditTerms = res;
      this.projectFormData = res;
    });
  }

  submitProjectForm(event: any) {
    if (event?.valid) {
      if (this.mode === "Add") {
        this.shopifyConnectorService.add(this.projectFormData).subscribe((res) => {
          this._showToast(res);
        });
      } else {
        this.shopifyConnectorService
          .update(this.paramId, this.projectFormData)
          .subscribe((res) => {
            this._showToast(res);
          });
      }
    }
  }

  _showToast(resp: any) {
    let type, msg;
    if(resp) {
      type = 'success';
      msg = this.mode === 'Add' ? MSG.create:MSG.update;
      this.router.navigate(["/business/shopify-connector"]);
    } else {
      type = 'error';
      msg = MSG.error;
    }
    this.toastService.open({
      value: [
        { severity: type, content: msg},
      ],
      life: 2000,
    });
  }

}
