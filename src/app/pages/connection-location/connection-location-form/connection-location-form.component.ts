import { Component, OnInit } from '@angular/core';
import { FormLayout } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { CreditTermsService } from 'src/app/@core/mock/credit-terms.service';

@Component({
  selector: 'app-connection-location-form',
  templateUrl: './connection-location-form.component.html',
  styleUrls: ['./connection-location-form.component.scss']
})
export class ConnectionLocationFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    nodeId: "",
    nodeName: "",
    nodeDesc: "",
    nodeType: "",
    lgStoreOwnerId: "",
    shopifyLocationId: "",
    physicalAddress: "",
    remarks: ""
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
      this.projectFormData = res;
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
