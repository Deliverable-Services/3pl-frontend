import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { CategoryListDataService } from "src/app/@core/mock/category-data.service";
import { UnitListDataService } from "src/app/@core/mock/unit-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-unit-form",
  templateUrl: "./unit-form.component.html",
  styleUrls: ["./unit-form.component.scss"],
})
export class UnitFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any>;
  projectFormData = {
    unitName: "",
  };
  mode: string = "Add";
  paramId: string = "";
  busy: Subscription;

  selectedUnit: any;

  formData = {};
  editForm: any = null;

  constructor(
    private unitListDataService: UnitListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getUnitById(this.paramId);
    }
  }

  getUnitById(id: string) {
    this.unitListDataService.getUnitById(id).subscribe((res: any) => {
      console.log({ res });
      this.selectedUnit = res;

      this.projectFormData = {
        unitName: this.selectedUnit?.unitName ?? "",
      };
    });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

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
        this.unitListDataService
          .addUnit(this.projectFormData)
          .subscribe((data) => {
            this.router.navigate(["/product/unit"]);
          });
      } else {
        this.unitListDataService
          .updateUnit(this.paramId, this.projectFormData)
          .subscribe((data) => {
            this.router.navigate(["/product/unit"]);
          });
      }
    } else {
      // error tip
    }
  }
}
