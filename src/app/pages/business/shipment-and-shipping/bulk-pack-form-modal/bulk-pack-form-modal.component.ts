import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { InventoryService } from "src/app/@core/mock/inventory.service";
import { PurchaseOrderService } from "src/app/@core/mock/purchase-order.service";

@Component({
  selector: "app-bulk-pack-form-modal",
  templateUrl: "./bulk-pack-form-modal.component.html",
  styleUrls: ["./bulk-pack-form-modal.component.scss"],
})
export class BulkPackFormModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  filteredData: any[] = [];
  variantList: any[] = [];
  selectedVariants: any[] = [];
  cartItems: any[] = [];
  detailsInputs: any[] = [];
  storePoDetails: any;
  searchWithStyleName: any = {
    keyword: "",
    sort: "asc",
    columnName: "styleName",
    searchType: "match",
  };
  selectedPoValue: any;
  selectedPoId: any;
  cartonDetails:any = {
    noOfCarton: null,
    qtyInOne: null,
    totalPackedQty: null,
    ctnCode: null,
    ctnNo: null,
    length: null,
    width: null,
    height: null,
    cbm: null,
    grossWeight: null,
    netWeight: null,
  }

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

    this.detailsInputs = this.data.info?.details?.map((d: any) => {
      let totalAdded: number = 0;
      this.data.info.packages?.forEach((p: any) => {
        let findPackageDetails = p?.details?.find((dm: any) => (dm?.poId === d?.poId && dm?.variant?.sku === d?.skuNo));
        if(findPackageDetails) {
          totalAdded = totalAdded + parseInt(findPackageDetails?.packageQuantity);
        }
      });
               
      return {
        poId: d?.poId,
        variantId: d?.variantId,
        skuNo: d?.skuNo,
        remainingQuantity: d?.poQuantity ? (d.poQuantity - (d.lockedQuantity+d.receivedQuantity)):0,
        skuDescription: d?.skuDescription,
        shippedQuantity: d?.shippedQuantity,
        receivedQuantity: d?.receivedQuantity ? d?.receivedQuantity : 0,
        packedQuantity: d?.packedQuantity ? d?.packedQuantity : 0,
        poDetailsId: d?.poDetailsId,
        totalAddedInPackage: totalAdded
      };
    });
  }

  getPoList() {
    this.purchaseOrderService.getPurchaseOrderList()
      .subscribe((res) => {
        // this.storePoDetails = res?.content?.filter((p: any) => (this.data.info.vendor.id === p.vendor.id
        //   && this.data.info.shipToLocation.connectionLocationId === p.shipToLocation.connectionLocationId));
        this.storePoDetails = this.detailsInputs?.map((d: any) => {
          let findMoreDetails = res?.content?.find((p: any) => p.id === d.poId)?.details;
          return {
            ...d,
            addtionalDetails: findMoreDetails.find((ad: any) => ad.id === d.poDetailsId)
          }
        });
        this.storePoDetails = this.storePoDetails?.map((s: any) => {
          return {
            ...s,
            valueToShow: `${s.poId} : ${s.addtionalDetails.skuNo} Shipment Remaining Qty : ${s?.shippedQuantity - s?.totalAddedInPackage}`
          }
        });
      });
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow numbers (0-9) and the full stop (decimal point)
    if ((charCode >= 48 && charCode <= 57) || charCode === 46) {
      return true;
    } else {
      return false;
    }
  }

  close($event: any) {
    this.modalClosed.emit(this.variantList);
    this.handler($event);
  }

  storeObjectData(obj: any) {
    // Check if the object is selected or deselected

    const variantIdExists = this.selectedVariants.some(
      (item) => item.variantId === obj.variantId
    );

    if (obj.selected) {
      if (!variantIdExists) {
        // Store the object's data in the selectedVariants array
        this.selectedVariants.push(obj);
        this.cartItems.push({
          selectedPoId: this.selectedPoId,
          packageQuantity: null,
          ...obj});
      }
    } else {
      // Remove the object from the selectedVariants array if deselected
      const index = this.selectedVariants.findIndex(
        (item) => item.variantId === obj.variantId
      );
      if (index !== -1) {
        this.selectedVariants.splice(index, 1);
        this.cartItems.splice(index, 1);
      }
    }
    this.data.vList(this.cartItems);
  }

  removeFromCart(index: number) {
    // Remove the item at the specified index from cartItems
    if (index >= 0 && index < this.cartItems.length) {
      const removedItem = this.variantList[index];
      removedItem.selected = false; // Deselect the item
      this.cartItems.splice(index, 1);
      this.selectedVariants.splice(index, 1);
      
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
    return this.storePoDetails?.find((p: any) => p.id === this.selectedPoId)?.details;
  }

  updateValue(event: any, keyName: string, index: number) {
    this.cartItems[index][keyName] = event.target.value;
    this.data.vList(this.cartItems);
  }

  updateCarton() {
    this.data.cartonDetails(this.cartonDetails);

    if(this.cartonDetails.length && this.cartonDetails.width && this.cartonDetails.height) {
      this.cartonDetails.cbm = (this.cartonDetails.length * this.cartonDetails.width * this.cartonDetails.height)/1000000;
    }

    if(this.cartonDetails.noOfCarton && this.cartonDetails.qtyInOne) {
      this.cartonDetails.totalPackedQty = this.cartonDetails.noOfCarton * this.cartonDetails.qtyInOne;
    }
  }
}
