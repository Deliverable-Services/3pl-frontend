import { Component, OnInit } from '@angular/core';
import { FormLayout } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { CreditTermsService } from 'src/app/@core/mock/credit-terms.service';

@Component({
  selector: 'app-credit-terms-form',
  templateUrl: './credit-terms-form.component.html',
  styleUrls: ['./credit-terms-form.component.scss']
})
export class CreditTermsFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    creditTermsSubject: "",
    creditTermsDetails: "",
    creditDay: "",
    status: "Active"
  };
  paramId: string = "";
  selectedCreditTerms: any = {};
  constructor(
    private creditTermsService: CreditTermsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getCreditTermsById(this.paramId);
    }
  }

  getCreditTermsById(id: string) {
    this.creditTermsService.getCreditTermsById(id).subscribe((res) => {
      console.log({ res });
      this.selectedCreditTerms = res;
    });
  }

  submitProjectForm(event: any) {
    console.log(':: :: ', event, this.projectFormData);
    if (event?.valid) {
      if (this.mode === "Add") {
        this.creditTermsService.addCreditTerms(this.projectFormData).subscribe((res) => {
          this.router.navigate(["/credit-terms"]);
        });
      } else {
        this.creditTermsService
          .updateCreditTerms(this.paramId, this.projectFormData)
          .subscribe((res) => this.router.navigate(["/credit-terms"]));
      }
    }
  }

}
