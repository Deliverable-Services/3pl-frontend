import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-brand-form",
  templateUrl: "./brand-form.component.html",
  styleUrls: ["./brand-form.component.scss"],
})
export class BrandFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any> | undefined;
  projectFormData = {
    brandName: "",
    brandCode: "",
  };
  mode: string = "Add";
  paramId: string = "";
  selectedBrand: any = {};

  seasonList: Season[] = [];
  brandList: Brand[] = [];
  formData = {};
  editForm: any = null;
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: "Season Name",
        prop: "seasonName",
        type: "input",
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: "Season Code",
        prop: "seasonCode",
        type: "input",

        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],

    labelSize: "",
  };
  busy: Subscription | undefined;
  constructor(
    private brandListDataService: BrandListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getBrandById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getBrandById(id: string) {
    this.brandListDataService.getBrandById(id).subscribe((res) => {
      this.selectedBrand = res;
      this.seasonList = res.seasons;
      this.projectFormData = {
        brandName: this.selectedBrand?.brandName ?? "",
        brandCode: this.selectedBrand?.brandCode ?? "",
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
    if (valid) {
      if (this.mode === "Add") {
        this.brandListDataService
          .addBrand(this.projectFormData)
          .subscribe((data) => {
            console.log("data", data);
            this.router.navigate(["/product/brand"]);
          });
      } else {
        console.log("in edit case", this.projectFormData);
        this.brandListDataService
          .updateBrand(this.paramId, this.projectFormData)
          .subscribe((data) => {
            console.log({ data });
            this.router.navigate(["/product/brand"]);
          });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }

  addSession() {
    console.log("click add session");
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Add Season",
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  editSeason(seasonId: any, rowId: any) {
    this.formData =
      this.seasonList.find((s: any) => {
        return s.seasonId === seasonId;
      }) ?? {};

    this.editForm = this.dialogService.open({
      id: "edit-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Edit Season",
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
    if (e.hasOwnProperty("seasonId")) {
      this.brandListDataService
        .editSeasonInBrand(this.paramId, e, e.seasonId)
        .subscribe(() => {
          this.getBrandById(this.paramId);
        });
    } else {
      this.brandListDataService
        .addSeasonInBrand(this.paramId, e)
        .subscribe(() => {
          console.log("add Season");
          this.getBrandById(this.paramId);
        });
    }
    this.editForm!.modalInstance.hide();
  }

  editBrand(rowId: any, index: number) {
    this.mode = "EDIT";
    this.router.navigate([`/pages/product/brand/edit/${rowId}`]);
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      seasonId: rowId.seasonId,
      brandId: this.paramId
    };

    this.brandListDataService.statusToggleSeason(data).subscribe((res: any) => {
      console.log(res);
    });
  }
}
