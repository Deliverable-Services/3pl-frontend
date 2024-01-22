import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerCodeService } from 'src/app/@core/mock/customer-code.service';
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-customer-code-form',
  templateUrl: './customer-code-form.component.html',
  styleUrls: ['./customer-code-form.component.scss']
})
export class CustomerCodeFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    customerCode: "",
    customerName: ""
  };
  paramId: string = "";
  selectedCreditTerms: any = {};
  constructor(
    private $service: CustomerCodeService,
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
      this.router.navigate(["/business/customer-code"]);
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
