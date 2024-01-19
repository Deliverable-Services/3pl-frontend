import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { InventoryService } from "src/app/@core/mock/inventory.service";

@Component({
  selector: "app-split-allocation-modal",
  templateUrl: "./split-allocation-modal.component.html",
  styleUrls: ["./split-allocation-modal.component.scss"],
})
export class SplitAllocationModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  splitDetailsfields: any[] = [
    { market: '', qty: '' }
  ];
  filteredData: any[] = [];
  variantList: any[] = [];
  selectedVariants: any[] = [];
  cartItems: any[] = [];
  exwSgdCost: any;
  searchWithStyleName: any = {
    keyword: "",
    sort: "asc",
    columnName: "styleName",
    searchType: "match",
  };

  constructor(
    private productsListDataService: ProductsListDataService,
    private inventoryService: InventoryService
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    let stSplitDetails = this.data?.sDetails?.splitAddress;

    if(stSplitDetails && Object.keys(stSplitDetails).length) { this.splitDetailsfields = []; }

    for (const key in stSplitDetails) {
      if (stSplitDetails.hasOwnProperty(key)) {
        console.log(`${key}: ${stSplitDetails[key]}`);

        let findSplitAddress = this.data?.shippingAddressList?.find((address: any) => address.id === key);

        this.splitDetailsfields.push(
          { market: findSplitAddress, qty: stSplitDetails[key] }
        );

        console.log(':: :: ', this.splitDetailsfields);

      }
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
        this.selectedVariants.push({
          ...obj,
          exwSgdCost: this.exwSgdCost
        });
        this.cartItems.push({
          ...obj,
          exwSgdCost: this.exwSgdCost
        });
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
    if (e.target.value?.length < 2) return;

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
          this.exwSgdCost = res.exwSgdCost;
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
        v.custName = `${v.sku}`;
        if (foundItem) {
          // v.custName = `${v.sku} - Available Qty: ${foundItem.avaiableQty}`;
          v.availableQty = foundItem.avaiableQty ? foundItem.avaiableQty : 0;
        } else {
          v.availableQty = 0;
          // v.custName = `${v.sku} - Available Qty: Not Available`;
        }
      });
    });
  }

  addMore() {
    this.splitDetailsfields.push(
      { market: '', qty: '' }
    );
  }

  removeRow(index: number) {
    this.splitDetailsfields.splice(index);
  }

  saveCurrentValue() {
    this.data.vList(this.splitDetailsfields);
  }
}
