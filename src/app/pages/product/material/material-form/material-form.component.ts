import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { MaterialListDataService } from "src/app/@core/mock/material-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-brand-form",
  templateUrl: "./material-form.component.html",
  styleUrls: ["./material-form.component.scss"],
})
export class MaterialFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any>;
  projectFormData = {
    materialName: "",
    hsCode: "",
    origin: "",
  };
  mode: string = "Add";
  paramId: string = "";
  selectedCategory: any = {};

  seasonList: Season[] = [];
  brandList: Brand[] = [];
  formData = {};
  editForm: any = null;

  busy: Subscription;
  constructor(
    private materialListDataService: MaterialListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    if (this.mode === "Edit") {
      this.getMaterialById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getMaterialById(id: string) {
    this.materialListDataService.getMaterialById(id).subscribe((res) => {
      console.log({ res });

      this.selectedCategory = res;

      this.projectFormData = {
        materialName: this.selectedCategory?.materialName ?? "",
        hsCode: this.selectedCategory?.hsCode ?? "",
        origin: this.selectedCategory?.origin ?? "",
      };
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
        this.materialListDataService
          .addMaterial(this.projectFormData)
          .subscribe((data) => {
            this.router.navigate(["/product/material"]);
          });
      } else {
        this.materialListDataService
          .updateMaterial(this.paramId, this.projectFormData)
          .subscribe((data) => {
            this.router.navigate(["/product/material"]);
          });
      }
    } else {
      // error tip
    }
  }
}
