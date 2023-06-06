import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";
import { ExchangeRateDataService } from "src/app/@core/mock/exchange-rate-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: 'app-exchange-rate-form',
  templateUrl: './exchange-rate-form.component.html',
  styleUrls: ['./exchange-rate-form.component.scss']
})
export class ExchangeRateFormComponent implements OnInit {
  exchangeRateFormData = {
    fromCurrency: "",
    toCurrency: "",
    rate: 1,
  };
  
  mode: string = "Add";
  paramId: string = "";


  busy: Subscription | undefined;
  selectedCategory: any;
  constructor(
    private exchangeRateService: ExchangeRateDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private companyDataService: CompanyDataService
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getExchangeRateById(this.paramId);
    }
    this.getCompanyList();
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  getExchangeRateById(id: string) {
    this.exchangeRateService.getExchangeRateById(id).subscribe((res) => {
      console.log({ res });
      this.exchangeRateFormData = res;   
    });

  }

  submitExchangeRateForm({ valid, directive, data, errors }: any) {
    if (valid) {
      if (this.mode === "Add") {
        this.exchangeRateService
          .addExchangeRate(this.exchangeRateFormData)
          .subscribe((data: any) => {
            this.router.navigate(["/business/exchange-rate"]);
          });
      } else {
        this.exchangeRateService
          .updateExchangeRate(this.paramId, this.exchangeRateFormData)
          .subscribe((data: any) => {
            this.getExchangeRateById(this.paramId);
          });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }

  getCompanyList() {
    this.busy = this.companyDataService
      .getCompanyList(undefined, undefined)
      .subscribe((res: any) => {
        this.exchangeRateFormData.toCurrency = res.primaryCurrency;
      });
  }
}

