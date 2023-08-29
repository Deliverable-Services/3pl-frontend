import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { ProductsListData } from "src/app/@core/data/styleList";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { ProductListDataService } from "src/app/@core/mock/product-data.service";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";
import { DaLayoutComponent } from "src/app/@shared/layouts/da-layout";
import { StyleSelectModelComponent } from "../style-select-model/style-select-model.component";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any> | undefined;

  productFormData = {
    productDesc: "",
    productSku: "",
    currency: "",
    price: "",
    style: {
      styleId: "",
    },
    productExt: {
      productExtId: "",
    },
  };

  mode: string = "Add";
  paramId: string = "";

  styleList: ProductsListData[] = [];

  formData = {};
  editForm: any = null;

  formConfig!: FormConfig;

  busy: Subscription | undefined;

  colorArray: any[] = [""];
  sizeArray: any[] = [""];
  colorArray1: any[] = [""];
  sizeArray1: any[] = [""];
  productArray: any[] = [];
  styleDialogFlag: boolean = true;

  isEnableProductbtn = true;

  styleParams: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "asc",
  };

  styleData: any = {
    styleName: "",
    styleCode: "",
    styleDesc: "",
    brand: {
      brandName: "",
    },
    season: {
      seasonName: "",
    },
    category: {
      categoryName: "",
    },
    subCategory: {
      subCategoryName: "",
    },
    material: {
      materialName: "",
    },
    unit: {
      unitName: "",
    },
  };
  materialToStr: any;

  constructor(
    private productListDataService: ProductListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private productsListDataService: ProductsListDataService
  ) {}

  async ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    await this.getStyleList();
    if (this.mode === "Edit") {
      this.getProductById();
    }
  }

  getProductById() {
    this.productListDataService
      .getProductById(this.paramId)
      .subscribe((res) => {
        let data: any = res;
        this.getStyleById(data.styleId);
        this.productFormData = {
          productDesc: data.product.productDesc,
          productSku: data.product.productSku,
          currency: data.product.currency,
          price: data.product.price,
          style: {
            styleId: data.styleId,
          },
          productExt: data.productExt,
        };

        this.productArray.push({
          price: data.product.price,
          size: data.product.size,
          color: data.product.color,
          productSku: data.product.productSku,
          productDesc: data.product.productDesc,
          currency: data.product.currency,
          eanUpc: data.product.productExt,
        });
      });
  }

  getStyleById(id: string) {
    this.productsListDataService.getById(id).subscribe((res) => {
      this.styleData = res;
      this.materialToStr = this.styleData.materials
        .map((val: any) => val.material.materialName)
        .join(",");

      console.log(this.styleData);
      this.productFormData.productDesc = this.styleData.styleDesc;
    });
  }

  async getStyleList() {
    this.busy = this.productsListDataService
      .getListActive()
      .subscribe((res) => {
        this.styleList = res.content;

        this.formConfig = {
          layout: FormLayout.Horizontal,
          items: [
            {
              label: "Style Name",
              prop: "styleName",
              type: "select",
              required: true,
              rule: {
                validators: [{ required: true }],
              },
              options: this.styleList,
            },
          ],

          labelSize: "",
        };

        console.log(this.styleList);

        if (this.mode === "Add") {
          this.chooseStyleSelection();
        }
      });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  chooseStyleSelection() {
    this.editForm = this.dialogService.open({
      id: "Choose Style Selection",
      width: "600px",
      maxHeight: "600px",
      title: "Choose a style",
      showAnimate: false,
      backdropCloseable: false,
      contentTemplate: this.EditorTemplate,
      onClose: () => {},
      buttons: [],
    });

    this.editForm.disableClose = true;
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.router.navigate([`/product/product`]);
  }

  onSubmitted(e: any) {
    this.getStyleById(e.styleName.styleId);
    this.productFormData.style.styleId = e.styleName.styleId;
    this.editForm!.modalInstance.hide();
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  // editRow(rowId: any, index: number) {
  //   this.mode = 'EDIT';
  //   // this.editRowIndex = index;
  //   // this.formData = row;
  //   console.log({ rowId });
  //   this.router.navigate([`/pages/product/brand/edit/${rowId}`]);
  // }

  addColorInput() {
    this.colorArray.push("");
  }
  removeColorInput(index: any) {
    this.colorArray.splice(index, 1);
  }

  addSizeInput() {
    this.sizeArray.push("");
  }
  removeSizeInput(index: any) {
    this.sizeArray.splice(index, 1);
  }

  colorChangeHandler(event: any, index: any) {
    console.log("event in color change handler", event.target.value);
    this.colorArray1.splice(index, 1, event.target.value);

    console.log("colorArray", this.colorArray);
    this.enableProductBtn();
  }

  sizeChangeHandler(event: any, index: any) {
    console.log("event in color change handler", event.target.value);

    this.sizeArray1.splice(index, 1, event.target.value);

    console.log("sizeArray", this.sizeArray1);
    this.enableProductBtn();
  }

  enableProductBtn() {
    let isColor = true;
    let isSize = true;
    this.colorArray1.forEach((cl) => {
      if (cl !== "") {
        isColor = false;
      } else {
        this.isEnableProductbtn = true;
      }
    });
    this.sizeArray1.forEach((sz) => {
      if (sz !== "") {
        if (!isColor) {
          this.isEnableProductbtn = false;
        }
      } else {
        this.isEnableProductbtn = true;
      }
    });
  }

  addProductHandler() {
    this.productArray = [];

    this.colorArray1.forEach((cl) => {
      this.sizeArray1.forEach((sz) => {
        this.productArray.push({
          price: "",
          productSku: "",
          size: sz,
          color: cl,
          productDesc: this.productFormData.productDesc,
          currency: this.productFormData.currency,
          eanUpc: "sdfs43few",
        });
      });
    });
  }

  submitAddProductForm(event: any) {
    console.log(this.productArray);
    let data;
    if (this.mode === "Add") {
      data = {
        styleId: this.productFormData.style.styleId,
        products: [...this.productArray],
      };
      this.productListDataService.addProduct(data).subscribe((res) => {
        this.router.navigateByUrl("/product/product");
      });
    } else {
      data = {
        ...this.productArray[0],
        eanUpc: this.productArray[0].eanUpc.productExtId,
      };

      this.productListDataService
        .updateProduct(data, this.paramId)
        .subscribe((res) => {
          this.router.navigateByUrl("/product/product");
        });
    }
  }

  removeProduct(index: number) {
    this.productArray.splice(index, 1);
  }
}
