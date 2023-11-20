import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { InventoryService } from "src/app/@core/mock/inventory.service";
import { PurchaseOrderService } from "src/app/@core/mock/purchase-order.service";

@Component({
  selector: "app-shipment-and-shipping-form-modal",
  templateUrl: "./shipment-and-shipping-form-modal.component.html",
  styleUrls: ["./shipment-and-shipping-form-modal.component.scss"],
})
export class ShipmentAndShippingFormModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  filteredData: any[] = [];
  variantList: any[] = [];
  selectedVariants: any[] = [];
  cartItems: any[] = [];
  storePoDetails: any;
  searchWithStyleName: any = {
    keyword: "",
    sort: "asc",
    columnName: "styleName",
    searchType: "match",
  };
  selectedPoId: any;

  constructor(
    private productsListDataService: ProductsListDataService,
    private inventoryService: InventoryService,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    this.purchaseOrderService.setPageParams({
      pageNo: "",
      pageSize: '100',
      sortBy: "",
      sortDir: "",
    });
    this.getPoList();
  }

  getPoList() {
    this.purchaseOrderService.getTransferOrderList()
      .subscribe((res) => {
        this.storePoDetails = res?.content?.filter((p: any) => {
          let dInfo = p?.details?.filter((v: any) => {
            let rQty = v?.poQuantity ? (v.poQuantity - (v.lockedQuantity+v.receivedQuantity)):0;
            return rQty !== 0;
          });
          return (p.orderStatus === 'RELEASED'
          && this.data.info.vendor.id === p.vendor.id
          && this.data.info.shipToLocation.connectionLocationId === p.shipToLocation.connectionLocationId
          && dInfo?.length)
        });
      });
  }

  close($event: any) {
    this.modalClosed.emit(this.variantList);
    this.handler($event);
  }

  storeObjectData(obj: any) {
    // Check if the object is selected or deselected

    // console.log(':: obj :: ', obj, this.cartItems)

    const variantIdExists = this.cartItems.some(
      (item) => (item.variantId === obj.variantId && this.selectedPoId === item?.selectedPoId)
    );

    if (obj.selected) {
      if (!variantIdExists) {
        // Store the object's data in the selectedVariants array
        // this.selectedVariants.push(obj);
        this.cartItems.push({
          selectedPoId: this.selectedPoId,
          ...obj});
      }
    } else {
      // Remove the object from the selectedVariants array if deselected
      const index = this.cartItems.findIndex(
        (item) => (item.variantId === obj.variantId && this.selectedPoId === item?.selectedPoId)
      );
      if (index !== -1) {
        // this.selectedVariants.splice(index, 1);
        this.cartItems.splice(index, 1);
      }
    }
    this.data.vList(this.cartItems);
  }

  removeFromCart(index: number) {
    // Remove the item at the specified index from cartItems
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems.splice(index, 1);
      // this.selectedVariants.splice(index, 1);
    }
  }

  search(e: any) {
    // return from here if length is not three
    if (e.target.value?.length < 3) return;

    this.searchWithStyleName.keyword = e.target.value;
    this.productsListDataService.setSearchParams(this.searchWithStyleName);
    this.getProductsList();
  }

  getProductsList() {
    this.productsListDataService.getList().subscribe((res) => {
      this.filteredData = res.content;
    });
  }
  selectedItem: string | null = null;

  selectItem(itemValue: string) {
    if (this.selectedItem === itemValue) {
      this.selectedItem = null; // Deselect if already selected
    } else {
      this.selectedItem = itemValue; // Select the clicked item
    }

    if (this.selectedItem) {
      this.productsListDataService
        .getById(this.selectedItem)
        .subscribe((res) => {
          res.variants.forEach((variant: any) => {
            variant.desc = res.logisticsDesc;
          });
          this.variantList = res.variants;
          this.getInventory(this.variantList?.map((v: any) => v.sku));
        });
    }
  }

  getInventory($sku: any) {
    let skuList: any[] = [];
    skuList.push({
      field: "sku",
      operator: "in",
      value: $sku,
    });
    if (this.data.origin) {
      skuList.push({
        field: "connectionLocationId",
        operator: "in",
        value: this.data.origin,
      });
    }
    this.inventoryService.getList(skuList).subscribe((res: any) => {
      this.variantList.forEach((v: any) => {
        const foundItem = res.content.find((item: any) => item.sku === v.sku);
        const checked = this.cartItems.find((item: any) => item.sku === v.sku);
        if(checked){
          v.itemAlreadySelected = true;
        }else{
          v.itemAlreadySelected = false;
        }
        if (foundItem) {
          v.custName = `${v.sku} - Available Qty: ${foundItem.avaiableQty}`;
          v.availableQty = foundItem.avaiableQty ? foundItem.avaiableQty : 0;
        } else {
          v.availableQty = 0;
          v.custName = `${v.sku} - Available Qty: Not Available`;
        }
      });
    });
  }

  _getFilteredVariants() {
    let getSelectedVariants = this.storePoDetails?.find((p: any) => p.id === this.selectedPoId)?.details;
    getSelectedVariants?.forEach((v: any) => {
      const fItem = this.cartItems.find((item: any) => item.skuNo === v.skuNo);
      if(fItem){
        v['itemAlreadySelected'] = true;
      } else {
        v['itemAlreadySelected'] = false;
      }
    });
    return this.storePoDetails?.find((p: any) => p.id === this.selectedPoId)?.details;
  }
}
