import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { InventoryService } from "src/app/@core/mock/inventory.service";

@Component({
  selector: "app-transfer-order-form-modal",
  templateUrl: "./transfer-order-form-modal.component.html",
  styleUrls: ["./transfer-order-form-modal.component.scss"],
})
export class TransferOrderFormModalComponent {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  filteredData: any[] = [];
  variantList: any[] = [];
  selectedVariants: any[] = [];
  cartItems: any[] = [];
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
        this.cartItems.push(obj);
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
}
