import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { TradeListDataService } from "src/app/@core/mock/Trade-data.service";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-tradeTerm-form",
  templateUrl: "./tradeTerm-form.component.html",
  styleUrls: ["./tradeTerm-form.component.scss"],
})
export class TradeTermFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any>;
  projectFormData = {
    tradeSubject: "",
    tradeDesc: "",
  };
  mode: string = "Add";
  paramId: string = "";
  selectedTrade: any = {};

  contactList: Season[] = [];
  brandList: Brand[] = [];
  formData = {};
  editForm: any = null;

  busy: Subscription;
  constructor(
    private tradeListDataService: TradeListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getTradeById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getTradeById(id: string) {
    this.tradeListDataService.getTradeById(id).subscribe((res) => {
      console.log({ res });
      this.selectedTrade = res;
      // this.contactList = res.vendorContacts;
      this.projectFormData = res;
    });
  }

  getValue(value: object) {
    console.log(value);
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    // this.editRowIndex = -1;
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  submitProjectForm({ valid, directive, data, errors }: any) {
    console.log("projectFormData", this.projectFormData);
    if (valid) {
      if (this.mode === "Add") {
        this.tradeListDataService
          .addTrade(this.projectFormData)
          .subscribe((data) => {
            console.log("data", data);
            this.router.navigate(["/business/trade-terms"]);
          });
      } else {
        console.log("in edit case", this.projectFormData);
        this.tradeListDataService
          .updateTrade(this.paramId, this.projectFormData)
          .subscribe((data) => {
            console.log({ data });
            this.router.navigate(["/business/trade-terms"]);
          });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }

  editBrand(rowId: any, index: number) {
    this.mode = "EDIT";
    // this.editRowIndex = index;
    // this.formData = row;
    console.log({ rowId });
    this.router.navigate([`/business/trade-terms/edit/${rowId}`]);
  }
}
