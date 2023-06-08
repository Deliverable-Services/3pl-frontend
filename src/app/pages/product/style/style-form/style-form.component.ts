import { style } from "@angular/animations";
import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Category } from "src/app/@core/data/categoryList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { CategoryListDataService } from "src/app/@core/mock/category-data.service";
import { MaterialListDataService } from "src/app/@core/mock/material-data.service";
import { ProductListDataService } from "src/app/@core/mock/product-data.service";
import { StyleListDataService } from "src/app/@core/mock/style-data.service";
import { UnitListDataService } from "src/app/@core/mock/unit-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-style-form",
  templateUrl: "./style-form.component.html",
  styleUrls: ["./stytle-form.component.scss"],
})
export class StyleFormComponent implements OnInit {
  styleFormData = {
    styleName: "",
    logisticsDesc: "",
    collection: "",
    fabricComposition: "",
    fabicSwatch: "",
    unitWeight: "",
    productCategoryId: "7eee1f7e-7ad6-40c5-b3aa-fa215d5b770f",
    image: "",
    varients: []
  }
  // {
  //   styleName: "",
  //   // styleCode: "",
  //   collection: "",
  //   fabricComposition: "",
  //   fabricSwatch: "",
  //   // brand: {
  //   //   brandId: "",
  //   //   seasons: [],
  //   // },
  //   // season: {
  //   //   seasonId: "",
  //   // },
  //   category: {
  //     categoryId: "",
  //     subCategories: [],
  //   },
  //   // subCategory: {
  //   //   subcategoryId: "",
  //   // },
  //   // materials: [],
  //   // unit: {
  //   //   unitId: "",
  //   // },
  //   unitWeight: "",
  //   logisticDescription: "",
  //   image: "",
  //   products: [],
  // };

  mode: string = "Add";
  paramId: string = "";
  busy: Subscription | undefined;

  categoryList: Category[] = [];
  brandList: Brand[] = [];
  seasonList: Season[] = [];
  subCategoryList: any = [];
  materialList: any = [];
  unitList: any = [];
  isEnableProductbtn = true;

  constructor(
    private productListDataService: ProductListDataService,
    private styleListDataService: StyleListDataService,
    private brandListDataService: BrandListDataService,
    private categoryListDataService: CategoryListDataService,
    private materialListDataService: MaterialListDataService,
    private unitListDataService: UnitListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getBrandListActive();
    this.getCategoryListActive();
    this.getMaterialListActive();
    this.getUnitListActive();

    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    if (this.mode === "Edit") {
      this.getStyleById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getStyleById(id: string) {
    this.styleListDataService.getStyleById(id).subscribe((res) => {
      this.styleFormData = res;
      // this.styleFormData.materials = res.materials.map((material: any) => {
      //   return material.material;
      // });
      console.log(this.styleFormData);
    });
  }

  getBrandListActive() {
    this.brandListDataService.getBrandListActive().subscribe((res: any) => {
      this.brandList = res.content;
    });
  }

  getSeasonList() {
    // return this.styleFormData.brand.seasons.filter(
    //   (season: any) => season.active === true
    // );
  }

  getCategoryListActive() {
    this.categoryListDataService
      .getCategoryListActive()
      .subscribe((res: any) => {
        this.categoryList = res.content;
      });
  }

  // getSubCategoryList() {
  //   return this.styleFormData.category.subCategories.filter(
  //     (subCategory: any) => subCategory.active === true
  //   );
  // }

  getMaterialListActive() {
    this.materialListDataService
      .getMaterialListActive()
      .subscribe((res: any) => {
        this.materialList = res.content;
      });
  }

  getUnitListActive() {
    this.unitListDataService.getUnitListActive().subscribe((res: any) => {
      this.unitList = res.content;
    });
  }

  getValue(value: object) {
    console.log(value);
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  submitStyleForm({ valid, directive, data, errors }: any) {
    console.log(this.styleFormData);

    const finaldata = {
      styleName: this.styleFormData.styleName,
      logisticsDesc: this.styleFormData.logisticsDesc,
      collection: this.styleFormData.collection,
      fabricComposition: this.styleFormData.fabricComposition,
      fabicSwatch: this.styleFormData.fabicSwatch,
      unitWeight: this.styleFormData.unitWeight,
      productCategoryId: this.styleFormData.productCategoryId,
      varients: []
    };

    console.log(finaldata, valid);

    if (valid) {
      console.log(':: :: 1')
      if (this.mode === "Add") {
        console.log(':: :: 2')
        this.styleListDataService.addStyle(finaldata).subscribe((res) => {
          this.router.navigate(["/product/style"]);
        });
      } else {
        console.log(':: :: 3')
        this.styleListDataService
          .updateStyle(this.paramId, finaldata)
          .subscribe((res) => this.router.navigate(["/product/style"]));
      }
    } else {
      console.log(':: :: 4')
      // error tip
    }
  }

  editProduct(rowId: any, index: number) {
    this.router.navigate([`/product/product/edit/${rowId}`]);
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      productId: rowId.productId,
    };
    this.productListDataService.statusToggle(data).subscribe((res: any) => {});
  }
}
