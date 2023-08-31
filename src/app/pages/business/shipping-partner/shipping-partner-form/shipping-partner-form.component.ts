import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { ShippingPartnerService } from 'src/app/@core/mock/shipping-partner.service';
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-shipping-partner-form',
  templateUrl: './shipping-partner-form.component.html',
  styleUrls: ['./shipping-partner-form.component.scss']
})
export class ShippingPartnerFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData:any = {
    address: "",
    businessRegNo: "",
    companyName: "",
    generalEmail: "",
    generalPhone: "",
    // id: "",
    primaryContactEmail: "",
    primaryContactName: "",
    primaryContactPhone1: "",
    primaryContactPhone2: "",
    status: "ACTIVE",
    website: ""
  };
  groups: any[] = ["SELECT","INTERNAL", "EXTERNAL"];
  rolesName: any[] = [];
  paramId: string = "";
  // selectedCreditTerms: any = {};
  constructor(
    private shippingPartnerService: ShippingPartnerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if(this.mode === 'Edit') {
      this.getById(this.paramId);
    }
  }
  
  getById(id: string) {
    this.shippingPartnerService.getById(id).subscribe((res) => {
      this.projectFormData = res;
      this.projectFormData.selectedRoles = res?.roles?.map((role: any) => role?.name);
    });
  }

  submitProjectForm(event: any) {
    let formData = this.projectFormData;
    delete formData.selectedRoles;
    if (event?.valid) {
      if(this.mode === 'Add') {
        this.shippingPartnerService
          .add(formData)
          .subscribe((res) => {
            this._showToast(res);
          });
      } else {
        this.shippingPartnerService
          .update(this.paramId, formData)
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
      this.router.navigate(["/business/shipping-partner"]);
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