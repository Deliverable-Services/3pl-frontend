import { style } from "@angular/animations";
import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout, ToastService } from "ng-devui";
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
import { MSG } from "src/config/global-var";

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
    slectedCat: {categoryId: ""},
    productCategoryId: "",
    image: "",
    varients: []
  }
  productVariants: any[] = [];
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
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // this.getBrandListActive();
    this.getCategoryListActive();
    // this.getMaterialListActive();
    // this.getUnitListActive();

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
      this.styleFormData.slectedCat = res?.productCategory;
      this.styleFormData.productCategoryId = res?.productCategory?.categoryId;
      if(!res?.varients?.length) {
        this.addMoreVariant();
      } else {
        this.productVariants = res?.varients || [];
        this.styleFormData.varients = res?.varients || [];
      }
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
      .getCategoryListActive({perPage: 100})
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
    // console.log(value);
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  submitStyleForm({ valid, directive, data, errors }: any) {
    const finaldata = {
      styleName: this.styleFormData.styleName,
      logisticsDesc: this.styleFormData.logisticsDesc,
      collection: this.styleFormData.collection,
      fabricComposition: this.styleFormData.fabricComposition,
      fabicSwatch: this.styleFormData.fabicSwatch,
      unitWeight: this.styleFormData.unitWeight,
      productCategoryId: this.styleFormData?.slectedCat?.categoryId,
      varients: this.productVariants
    };

    if (valid) {
      if (this.mode === "Add") {
        this.styleListDataService.addStyle(finaldata).subscribe((res) => this._showToast(res));
      } else {
        this.styleListDataService
          .updateStyle(this.paramId, finaldata)
          .subscribe((res) => this._showToast(res));
      }
    } else {
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

  removeProduct(index: number) {
    this.productVariants.splice(index, 1);
  }

  addMoreVariant() {
    this.productVariants.push({
      sku: "",
      color: "",
      size: "",
      label: "",
      hastagColor: "",
      productDesc: "",
      localCurrency: "",
      localExwPrice: "",
      companyExwPrice: ""
    });
  }

  updateValue(event: any, keyName: string, index: number) {
    this.productVariants[index][keyName] = event.target.value;
  }

  _showToast(resp: any) {
    let type, msg;
    if(resp) {
      type = 'success';
      msg = this.mode === 'Add' ? MSG.create:MSG.update;
      this.router.navigate(["/product/style"]);
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

  _checkForBtn() {
    let getVal = this.productVariants.filter((pv: any) => {
      let getBlank = Object.keys(pv)?.filter((k: any) => pv[k] !== '');
      return !getBlank?.length; 
    });

    return !getVal?.length;
  }
}
