import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { ShippingAddressService } from 'src/app/@core/mock/shipping-address.service';
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-shipping-address-form',
  templateUrl: './shipping-address-form.component.html',
  styleUrls: ['./shipping-address-form.component.scss']
})
export class ShippingAddressFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    address: "",
    locationName: "",
    market: "",
    shipTo: false,
    split: false
  };
  paramId: string = "";
  selectedCreditTerms: any = {};
  constructor(
    private $service: ShippingAddressService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getCreditTermsById(this.paramId);
    }
  }

  getCreditTermsById(id: string) {
    this.$service.getCreditTermsById(id).subscribe((res) => {
      console.log({ res });
      this.selectedCreditTerms = res;
      this.projectFormData = res;
    });
  }

  submitProjectForm(event: any) {
    if (event?.valid) {
      if (this.mode === "Add") {
        this.$service.add(this.projectFormData).subscribe((res) => {
          this._showToast(res);
        });
      } else {
        this.$service
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
      this.router.navigate(["/business/shipping-address"]);
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
