import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormLayout } from "ng-devui";
import { Product } from "src/app/@core/data/productList";
import { ProductsListData } from "src/app/@core/data/styleList";
import { PoDataService } from "src/app/@core/mock/po-data.service";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";

@Component({
  selector: "app-purchase-order-line-form",
  templateUrl: "./purchase-order-line-form.component.html",
  styleUrls: ["./purchase-order-line-form.component.scss"],
})
export class PurchaseOrderLineFormComponent implements OnInit {
  @Input() data: any;

  layout = FormLayout.Vertical;
  labelSize = "";

  poLineFormData = {
    style: {
      styleId: "",
      stykeName: "",
      unit: {
        unitName: "",
      },
      products: [],
    },
    products: [],
  };

  poList: any = [];
  poDetailList: any = [];
  styleList!: any;
  productList: Product[] = [];
  poLineArray: any[] = [];

  constructor(
    private poDataService: PoDataService,
    private productsListDataService: ProductsListDataService
  ) {}

  ngOnInit(): void {
    this.getStyleList();
  }

  submitPoLine({ valid }: { valid: boolean }) {
    if (valid) {
      this.data.returnData({
        poDetails: [...this.poLineArray],
      });
    } else {
      this.data.returnData(undefined);
    }
  }

  cancel() {
    this.data.close();
  }

  getStyleList() {
    this.productsListDataService.getList().subscribe((res) => {
      this.styleList = res.content;
    });
  }

  getStyleById(id: string) {
    this.productsListDataService.getById(id).subscribe((res) => {
      this.poLineFormData.style = res;
      this.productList = this.poLineFormData.style.products;
    });
  }

  addPOItems() {
    this.poLineArray = this.poLineArray.filter((poLine: any) => { 
      this.poLineFormData.products.find((product: any) => { 
        return poLine.productSku === product.productSku;
      })  
    })

    this.poLineFormData.products.map((product: any) => {
      const index = this.poLineArray.findIndex((poLine: any) => {
        return poLine.productSku === product.productSku;
      });
      if (index === -1) {
        this.poLineArray.push({
          productSku: product.productSku,
          productPrice: product.price,
          vendorPrice: 100,
          poQty: "",
          unitName: this.poLineFormData.style.unit.unitName,
        });
      }
    });
  }

  removePoItem(id: number) {
    this.poLineFormData.products = this.poLineFormData.products.filter(
      (product: any) => {
        return this.poLineArray[id].productSku !== product.productSku;
      }
    );
    this.poLineArray.splice(id, 1);
  }
}
