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
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.scss"],
})
export class CategoryFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any> | undefined;
  projectFormData = {
    categoryName: "",
  };
  mode: string = "Add";
  paramId: string = "";
  busy: Subscription | undefined;

  categoryList: Brand[] = [];
  subCategoryList: any = [];
  selectedCategory: any = null;
  formData = {};
  editForm: any = null;
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: "Sub Category ",
        prop: "subCategoryName",
        type: "input",

        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],

    labelSize: "",
  };
  constructor(
    private categoryListDataService: CategoryListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getCategoryById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getCategoryById(id: string) {
    this.categoryListDataService.getCategoryById(id).subscribe((res) => {
      console.log({ res });
      this.selectedCategory = res;
      this.subCategoryList = res.subCategories;

      this.projectFormData = {
        categoryName: this.selectedCategory?.categoryName ?? "",
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
        this.categoryListDataService
          .addCategory(this.projectFormData)
          .subscribe((data) => {
            this.router.navigate(["/product/category"]);
          });
      } else {
        this.categoryListDataService
          .updateCategory(this.paramId, this.projectFormData)
          .subscribe((data) => {
            this.router.navigate(["/product/category"]);
          });
      }
    } else {
      // error tip
    }
  }

  addSubCategory() {
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Add Sub-Category",
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  editSubCategory(subcategoryId: any, rowId: any) {
    this.formData =
      this.subCategoryList.find((s: any) => {
        return s.subcategoryId === subcategoryId;
      }) ?? {};

    this.editForm = this.dialogService.open({
      id: "edit-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Edit Sub-Category",
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {
        this.formData = {};
      },
      buttons: [],
    });
  }

  onSubmitted(e: any) {
    console.log(e);
    if (e.hasOwnProperty("subcategoryId")) {
      this.categoryListDataService
        .editSubCategory(this.paramId, e, e.subcategoryId)
        .subscribe(() => {
          this.getCategoryById(this.paramId);
        });
    } else {
      this.categoryListDataService
        .addSubCategory(this.paramId, e)
        .subscribe(() => {
          this.getCategoryById(this.paramId);
        });
    }
    this.editForm!.modalInstance.hide();
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      subcategoryId: rowId.subcategoryId,
      categoryId: this.paramId,
    };

    this.categoryListDataService
      .statusToggleSubCat(data)
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
