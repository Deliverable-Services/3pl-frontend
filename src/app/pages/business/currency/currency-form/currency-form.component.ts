import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { Subscription } from "rxjs";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";
import { CurrencyDataService } from "src/app/@core/mock/currency-data.service";
import { MSG } from "src/config/global-var";

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.scss']
})
export class CurrencyFormComponent implements OnInit {
  currencyFormData = {
    currencyName: "",
    createdBy:"",
    lastModifiedBy:"",
    lastModifiedDate:"",
    currencyCode: "",
    createdDate:"",
    rate: 1,
    remarks:""
  };
  
  mode: string = "Add";
  paramId: string = "";


  busy: Subscription | undefined;
  selectedCategory: any;
  constructor(
    private currencyDataService: CurrencyDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private companyDataService: CompanyDataService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getCurrencyById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  getCurrencyById(id: string) {
    this.currencyDataService.getCurrencyById(id).subscribe((res) => {
      console.log({ res });
      this.currencyFormData = res;   
    });

  }

  submitCurrencyForm({ valid, directive, data, errors }: any) {
    if (valid) {
      if (this.mode === "Add") {
        this.currencyDataService
          .addCurrency(this.currencyFormData)
          .subscribe((data: any) => this._showToast(data));
      } else {
        this.currencyDataService
          .updateCurrency(this.paramId, this.currencyFormData)
          .subscribe((data: any) => {
            // this.getCurrencyById(this.paramId);
            this._showToast(data);
          });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }

  _showToast(resp: any) {
    let type, msg;
    if(resp) {
      type = 'success';
      msg = this.mode === 'Add' ? MSG.create:MSG.update;
      this.router.navigate(["/business/currency"]);
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

