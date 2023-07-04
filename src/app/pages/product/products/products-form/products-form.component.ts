import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { Subscription } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { Category } from "src/app/@core/data/categoryList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { CategoryListDataService } from "src/app/@core/mock/category-data.service";
import { MaterialListDataService } from "src/app/@core/mock/material-data.service";
import { ProductListDataService } from "src/app/@core/mock/product-data.service";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { UnitListDataService } from "src/app/@core/mock/unit-data.service";
import { MSG } from "src/config/global-var";

@Component({
  selector: "app-products-form",
  templateUrl: "./products-form.component.html",
  styleUrls: ["./products-form.component.scss"],
})
export class ProductsFormComponent implements OnInit {
  productsFormData = {
    styleName: "",
    logisticsDesc: "",
    collection: "",
    fabricComposition: "",
    fabicSwatch: "",
    unitWeight: "",
    slectedCat: {categoryId: ""},
    optionType: "",
    retailPrice: "",
    exwLocalCurrency: "",
    exwLocalCost: "",
    exwSgdCost: "",
    productCategoryId: "",
    image: "",
    status: "",
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
  optionTypeList: any[] = ['NONE', 'COLOR', 'SIZE', 'COLOR_SIZE'];
  brandList: Brand[] = [];
  seasonList: Season[] = [];
  subCategoryList: any = [];
  materialList: any = [];
  unitList: any = [];
  isEnableProductbtn = true;

  constructor(
    private productListDataService: ProductListDataService,
    private productsListDataService: ProductsListDataService,
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
    this.productsListDataService.getById(id).subscribe((res) => {
      this.productsFormData = res;      
      this.productsFormData.slectedCat = res?.productCategory;
      this.productsFormData.productCategoryId = res?.productCategory?.categoryId;
      if(!res?.variants?.length) {        
        this.addMoreVariant();
      } else {
        const modifiedItems = res?.variants.map(({ createdDate, createdBy, lastModifiedBy, lastModifiedDate, ...rest }: { createdDate: string, createdBy: string, lastModifiedBy: string, lastModifiedDate: string }) => rest);
        this.productVariants = modifiedItems || [];
        this.productsFormData.varients = modifiedItems || [];
      }
    });
  }

  getBrandListActive() {
    this.brandListDataService.getBrandListActive().subscribe((res: any) => {
      this.brandList = res.content;
    });
  }

  getSeasonList() {
    // return this.productsFormData.brand.seasons.filter(
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
  //   return this.productsFormData.category.subCategories.filter(
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

  confirmPublish(): void {
    const finaldata = {
      styleName: this.productsFormData.styleName,
      logisticsDesc: this.productsFormData.logisticsDesc,
      collection: this.productsFormData.collection,
      fabricComposition: this.productsFormData.fabricComposition,
      fabicSwatch: this.productsFormData.fabicSwatch,
      unitWeight: this.productsFormData.unitWeight,
      productCategoryId: this.productsFormData?.slectedCat?.categoryId,
      exwLocalCurrency: this.productsFormData?.exwLocalCurrency,
      exwLocalCost:this.productsFormData.exwLocalCost,
      exwSgdCost: this.productsFormData?.exwSgdCost,
      retailPrice: this.productsFormData?.retailPrice,
      optionType: this.productsFormData?.optionType,
      variants: this.productVariants,
    };
    if (window.confirm('Are you sure you want to publish?')) {
      this.mode = 'edit';
      this.productsListDataService
          .setPublish(this.paramId, finaldata)
          .subscribe((res) => this._showToast(res));
    }
  }

  confirmInactive(): void {
    if (window.confirm('Are you sure you want to publish?')) {
      this.mode = 'edit';
      this.productsListDataService
          .setInactive(this.paramId)
          .subscribe((res) => this._showToast(res));
    }
  }

  confirmActive(): void {
    if (window.confirm('Are you sure you want to publish?')) {
      this.mode = 'edit';
      this.productsListDataService
          .setActive(this.paramId)
          .subscribe((res) => this._showToast(res));
    }
  }

  getValue(value: object) {
    // console.log(value);
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  submitStyleForm({ valid, directive, data, errors }: any) {
    const finaldata = {
      styleName: this.productsFormData.styleName,
      logisticsDesc: this.productsFormData.logisticsDesc,
      collection: this.productsFormData.collection,
      fabricComposition: this.productsFormData.fabricComposition,
      fabicSwatch: this.productsFormData.fabicSwatch,
      unitWeight: this.productsFormData.unitWeight,
      productCategoryId: this.productsFormData?.slectedCat?.categoryId,
      exwLocalCurrency: this.productsFormData?.exwLocalCurrency,
      exwLocalCost:this.productsFormData.exwLocalCost,
      exwSgdCost: this.productsFormData?.exwSgdCost,
      retailPrice: this.productsFormData?.retailPrice,
      optionType: this.productsFormData?.optionType,
      variants: this.productVariants,
    };

    if (valid) {
      if (this.mode === "Add") {
        this.productsListDataService.add(finaldata).subscribe((res) => this._showToast(res));
      } else {
        this.productsListDataService
          .update(this.paramId, finaldata)
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
      barcode: "",
      color: "",
      size: "",
      label: "",
      hangtagColor: "",
      productDesc: "",
      // localCurrency: "",
      // localExwPrice: "",
      // companyExwPrice: ""
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
      this.router.navigate(["/product/products"]);
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
    let allowed = true;
    this.productVariants.forEach((pv: any) => {
      allowed = true;
      if(pv['sku'] === '') {
        allowed = false;return;} 
      if(pv['color'] === '' && (this.productsFormData.optionType === 'COLOR_SIZE' || this.productsFormData.optionType === 'COLOR')){
        allowed = false;return; }
      if(pv['size'] === '' && (this.productsFormData.optionType === 'COLOR_SIZE' || this.productsFormData.optionType === 'SIZE')){
        allowed = false;return; }
      if(pv['label'] === ''){
        allowed = false;return;} 
      if(pv['hangtagColor'] === ''){
        allowed = false;return;    }     
    });

    return allowed;
  }

  checkVIsibility(type: string) {
    if(this.productsFormData.optionType === type 
    || this.productsFormData.optionType === 'COLOR_SIZE')
      return true;

    return false;  
  }
}
