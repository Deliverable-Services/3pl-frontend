import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout, ToastService } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";
import { MSG } from "src/config/global-var";

@Component({
  selector: "app-company-form",
  templateUrl: "./company-form.component.html",
  styleUrls: ["./company-form.component.scss"],
})
export class CompanyFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any> | undefined;
  companyFormData = {
    companyName: "",
    businessAddress: "",
    primaryCurrencyName: "",
    primaryCurrencyCode:"",
    contactPhone:"",
    contactEmail:"",
    contactPerson: "",
    createdDate: "",
    lastModifiedDate: "",
  };

  mode: string = "Add";
  paramId: string = "";
  selectedBrand: any = {};

  seasonList: Season[] = [];
  brandList: Brand[] = [];
  formData = {};
  editForm: any = null;

  busy: Subscription | undefined;
  selectedCategory: any;
  constructor(
    private companyDataService: CompanyDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getCompanyList();
  }

  getCompanyList() {
    this.busy = this.companyDataService
      .getCompanyList(undefined, undefined)
      .subscribe((res: any) => {
        console.log(res);
        if (res.companyId === undefined) {
          this.mode = "Add";
        } else {
          this.mode = "Edit";
        }

        this.companyFormData = {
          companyName: res.companyName ?? "",
          businessAddress: res.businessAddress ?? "",
          createdDate: res.createdDate ?? "",
          lastModifiedDate: res.lastModifiedDate ?? "",
          contactEmail: res.contactEmail ?? "",
          primaryCurrencyCode: res.primaryCurrencyCode ?? "",
          primaryCurrencyName: res.primaryCurrencyName ?? "",
          contactPerson: res.contactPerson ?? "",
          contactPhone: res.contactPhone ?? "",
        };
      });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  submitCompanyForm({ valid, directive, data, errors }: any) {
    if (valid) {
      if (this.mode === "Add") {
        this.companyDataService
          .addCompany(this.companyFormData)
          .subscribe((data: any) => {
            this.router.navigate(["/business/company"]);
          });
      } else {
        this.companyDataService
          .updateCompany(this.paramId, this.companyFormData)
          .subscribe((data: any) => {
            // this.router.navigate(["/business/company"]);
            let type, msg;
            if(data) {
              type = 'success';
              msg = MSG.update;
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
          });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }
}
