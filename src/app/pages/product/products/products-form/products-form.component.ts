import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { Subscription } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { Category } from "src/app/@core/data/categoryList";
import { CurrencyListData } from "src/app/@core/data/CurrencyList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { CurrencyDataService } from "src/app/@core/mock/currency-data.service";
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
    commodityCode: "",
    collection: "",
    fabricComposition: "",
    fabicSwatch: "",
    unitWeight: "",
    slectedCat: { categoryId: "" },
    selectedCurrency: { currencyId: "" },
    optionType: "",
    retailPrice: "",
    exwLocalCurrency: "",
    exwLocalCost: 0,
    exwSgdCost: 0,
    productCategoryId: "",
    companyExwPrice: 0,
    image: "",
    countryOfOrigin: "",
    status: "",
    varients: [],
  };
  productVariants: any[] = [];
  imageUrl: string | ArrayBuffer | null = null;

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
  currencyRate: any = 0;
  productImage: any = null;
  paramId: string = "";
  busy: Subscription | undefined;

  categoryList: Category[] = [];
  currencyList: any[] = [];
  currencyData: any[] = [];
  optionTypeList: any[] = ["NONE", "COLOR", "SIZE", "COLOR_SIZE"];
  brandList: Brand[] = [];
  seasonList: Season[] = [];
  subCategoryList: any = [];
  materialList: any = [];
  unitList: any = [];
  isEnableProductbtn = true;
  countriesData: any[] = [];
  selectedCountry = {
    code_alpha2: "",
    code_alpha3: "",
    code_num: "",
    calling_code: "",
    dcpn: "",
    capid: "",
  };

  constructor(
    private productListDataService: ProductListDataService,
    private productsListDataService: ProductsListDataService,
    private brandListDataService: BrandListDataService,
    private currencyDataService: CurrencyDataService,
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
    this.getCurrencyListActive();
    this.productsListDataService.getCountriesData().subscribe((data) => {
      data.forEach((country: any) => {
        this.countriesData.push(country);
      });
    });

    console.log("country data: ", this.countriesData);

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
      this.countriesData.forEach((country) => {
        if (res.countryOfOrigin === country.code_alpha2) {
          this.selectedCountry = country.dcpn;
        }
      });
      this.imageUrl = res.image;
      this.productsFormData.productCategoryId =
        res?.productCategory?.categoryId;
      if (!res?.variants?.length) {
        this.addMoreVariant();
      } else {
        const modifiedItems = res?.variants.map(
          ({
            createdDate,
            createdBy,
            lastModifiedBy,
            lastModifiedDate,
            ...rest
          }: {
            createdDate: string;
            createdBy: string;
            lastModifiedBy: string;
            lastModifiedDate: string;
          }) => rest
        );
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
      .getCategoryListActive({ perPage: 100 })
      .subscribe((res: any) => {
        this.categoryList = res.content;
      });
  }

  isFormDisabled(status: string): boolean {
    return status === "Active" || status === "Inactive";
  }

  getCurrencyListActive() {
    this.currencyDataService
      .getCurrencyListActive({ perPage: 100 })
      .subscribe((res: any) => {
        this.currencyData = res.content;
        this.currencyList = res.content.map((el: any) => {
          return el.currencyCode;
        });
        console.log("currency list active", this.currencyList);
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
      commodityCode: this.productsFormData.commodityCode,
      countryOfOrigin: this.productsFormData.countryOfOrigin,
      collection: this.productsFormData.collection,
      fabricComposition: this.productsFormData.fabricComposition,
      fabicSwatch: this.productsFormData.fabicSwatch,
      unitWeight: this.productsFormData.unitWeight,
      productCategoryId: this.productsFormData?.slectedCat?.categoryId,
      exwLocalCurrency: this.productsFormData?.exwLocalCurrency,
      companyExwPrice: this.productsFormData?.companyExwPrice,
      exwLocalCost: this.productsFormData.exwLocalCost,
      exwSgdCost: this.productsFormData?.exwSgdCost,
      retailPrice: this.productsFormData?.retailPrice,
      optionType: this.productsFormData?.optionType,
      variants: this.productVariants,
    };
    // if (window.confirm('Are you sure you want to publish?')) {
    //   this.mode = 'edit';
    //   this.productsListDataService
    //       .setPublish(this.paramId, finaldata)
    //       .subscribe((res) => this._showToast(res));
    // }
    this._showPopUp("publish", finaldata);
  }

  confirmInactive(): void {
    // if (window.confirm('Are you sure you want to publish?')) {
    //   this.mode = 'edit';
    //   this.productsListDataService
    //       .setInactive(this.paramId)
    //       .subscribe((res) => this._showToast(res));
    // }
    this._showPopUp("inactive");
  }

  confirmActive(): void {
    // if (window.confirm('Are you sure you want to publish?')) {
    //   this.mode = 'edit';
    //   this.productsListDataService
    //       .setActive(this.paramId)
    //       .subscribe((res) => this._showToast(res));
    // }
    this._showPopUp("active");
  }

  getValue(value: object) {
    // console.log(value);
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Restrict to two decimal places
    const restrictedValue = this.restrictDecimal(value, 2);

    // Update the input value
    input.value = restrictedValue;
  }

  restrictDecimal(value: string, decimalPlaces: number): string {
    const regex = new RegExp(`^-?\\d+(\\.\\d{0,${decimalPlaces}})?`);
    const match = value.match(regex);

    return match ? match[0] : "";
  }

  submitStyleForm({ valid, directive, data, errors }: any) {
    const finaldata = {
      styleName: this.productsFormData.styleName,
      logisticsDesc: this.productsFormData.logisticsDesc,
      commodityCode: this.productsFormData.commodityCode,
      countryOfOrigin: this.productsFormData.countryOfOrigin,
      collection: this.productsFormData.collection,
      fabricComposition: this.productsFormData.fabricComposition,
      fabicSwatch: this.productsFormData.fabicSwatch,
      unitWeight: this.productsFormData.unitWeight,
      productCategoryId: this.productsFormData?.slectedCat?.categoryId,
      exwLocalCurrency: this.productsFormData?.exwLocalCurrency,
      exwLocalCost: this.productsFormData.exwLocalCost,
      companyExwPrice: this.productsFormData?.companyExwPrice,
      exwSgdCost: this.productsFormData?.exwSgdCost,
      retailPrice: this.productsFormData?.retailPrice,
      optionType: this.productsFormData?.optionType,
      variants: this.productVariants,
    };

    console.log(this.productsFormData.image);

    if (valid) {
      if (this.mode === "Add") {
        this.productsListDataService.add(finaldata).subscribe(
          (res) => {
            console.log("this.productImage", this.productImage);

            if (this.productImage) {
              this.uploadProductImage();
            }
            this._showToast(res);
          },
          (error) => console.log(error)
        );
      } else {
        this.productsListDataService.update(this.paramId, finaldata).subscribe(
          (res) => {
            this._showToast(res);
            console.log("this.productImage", this.productImage);
            if (this.productImage) {
              this.uploadProductImage();
            }
          },
          (error) => console.log(error)
        );
      }
    } else {
      // error tip
    }
  }

  removeProductRow(index: number) {
    this.productVariants.splice(index, 1);
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
    if (resp) {
      type = "success";
      msg = this.mode === "Add" ? MSG.create : MSG.update;
      this.router.navigate(["/product/products"]);
    } else {
      type = "error";
      msg = MSG.error;
    }
    this.toastService.open({
      value: [{ severity: type, content: msg }],
      life: 2000,
    });
  }

  _checkForBtn() {
    let allowed = true;
    this.productVariants.forEach((pv: any) => {
      allowed = true;
      if (pv["sku"] === "") {
        allowed = false;
        return;
      }
      if (
        pv["color"] === "" &&
        (this.productsFormData.optionType === "COLOR_SIZE" ||
          this.productsFormData.optionType === "COLOR")
      ) {
        allowed = false;
        return;
      }
      if (
        pv["size"] === "" &&
        (this.productsFormData.optionType === "COLOR_SIZE" ||
          this.productsFormData.optionType === "SIZE")
      ) {
        allowed = false;
        return;
      }
      if (pv["label"] === "") {
        allowed = false;
        return;
      }
      if (pv["hangtagColor"] === "") {
        allowed = false;
        return;
      }
    });

    return allowed;
  }

  updateCompanyExwPrice() {
    if (
      this.productsFormData.exwLocalCost &&
      this.productsFormData.exwLocalCurrency
    ) {
      this.currencyData.forEach((c) => {
        if (this.productsFormData.exwLocalCurrency === c.currencyCode) {
          this.currencyRate = c.rate;
        }
      });
      if (!isNaN(this.productsFormData.exwLocalCost)) {
        this.productsFormData.exwSgdCost = Number(
          (this.productsFormData.exwLocalCost / this.currencyRate).toFixed(2)
        );
      }
    }
  }

  checkVIsibility(type: string) {
    if (
      this.productsFormData.optionType === type ||
      this.productsFormData.optionType === "COLOR_SIZE"
    )
      return true;

    return false;
  }

  _errorPopUp(error: string) {
    let checkPopup = this.dialogService.open({
      id: "manage-confirmation",
      width: "350px",
      maxHeight: "600px",
      title: error,
      backdropCloseable: false,
      content: "",
      showCloseBtn: false,
      dialogtype: "warning",
      onClose: () => {},
      buttons: [
        {
          cssClass: "info",
          text: "Close",
          handler: ($event: Event) => {
            checkPopup.modalInstance.hide();
          },
        },
      ],
    });
  }
  _showPopUp(type: string, fData?: any) {
    let checkPopup = this.dialogService.open({
      id: "manage-confirmation",
      width: "350px",
      maxHeight: "600px",
      title: "Are you sure you want to that?",
      backdropCloseable: false,
      content: "",
      showCloseBtn: false,
      dialogtype: "warning",
      onClose: () => {},
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          handler: ($event: Event) => {
            if (type === "publish") {
              this.productsListDataService
                .setPublish(this.paramId, fData)
                .subscribe(
                  (res) => {
                    this._showToast(res);
                    if (this.productImage) {
                      this.uploadProductImage();
                    }
                  },
                  (error) => console.log(error)
                );
            } else if (type === "inactive") {
              this.productsListDataService.setInactive(this.paramId).subscribe(
                (res) => this._showToast(res),
                (error) => console.log(error)
              );
            } else if (type === "active") {
              this.productsListDataService.setActive(this.paramId).subscribe(
                (res) => this._showToast(res),
                (error) => console.log(error)
              );
            }
            checkPopup.modalInstance.hide();
          },
        },
        {
          cssClass: "info",
          text: "Cancel",
          handler: ($event: Event) => {
            checkPopup.modalInstance.hide();
          },
        },
      ],
    });
  }
  setListId() {
    this.productsFormData.countryOfOrigin = this.selectedCountry.code_alpha2;
  }
  setUploadImage(event: any) {
    this.productImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(this.productImage);
  }
  uploadProductImage() {
    const formData = new FormData();
    formData.append("file", this.productImage);
    this.productsListDataService
      .uploadProductImage(this.paramId, formData)
      .subscribe(
        (res) => this._showToast(res),
        (error) => console.log(error)
      );
  }
}
