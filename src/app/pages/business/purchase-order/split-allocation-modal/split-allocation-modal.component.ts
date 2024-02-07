import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { InventoryService } from "src/app/@core/mock/inventory.service";
import { ToastService } from "ng-devui";
@Component({
  selector: "app-split-allocation-modal",
  templateUrl: "./split-allocation-modal.component.html",
  styleUrls: ["./split-allocation-modal.component.scss"],
})
export class SplitAllocationModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  stShippingAddressInfo: any[] = [];
  splitDetailsfields: any[] = [{ market: "", qty: "" }];
  filteredData: any[] = [];
  variantList: any[] = [];
  selectedVariants: any[] = [];
  cartItems: any[] = [];
  totalQty = 0;
  exwSgdCost: any;
  searchWithStyleName: any = {
    keyword: "",
    sort: "asc",
    columnName: "styleName",
    searchType: "match",
  };
  splitSummaryDetails: any[] = [];
  childCaseIds: any[] = [];

  constructor(
    private productsListDataService: ProductsListDataService,
    private inventoryService: InventoryService,
    private toastService: ToastService
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    console.log("this.data?.sDetails", this.data?.sDetails);

    let stSplitDetails = this.data?.sDetails?.splitAddress;

    if (stSplitDetails && Object.keys(stSplitDetails).length) {
      this.splitDetailsfields = [];
    }

    this.stShippingAddressInfo = this.data?.shippingAddressList?.map(
      (sAddress: any) => {
        return {
          ...sAddress,
          keyToUse: sAddress.market + " - " + sAddress.locationName,
        };
      }
    );

    for (const key in stSplitDetails) {
      if (stSplitDetails.hasOwnProperty(key)) {
        let findSplitAddress = this.data?.shippingAddressList?.find(
          (address: any) => address.id === key
        );
        findSplitAddress["keyToUse"] =
          findSplitAddress.market + " - " + findSplitAddress.locationName;

        this.splitDetailsfields.push({
          market: findSplitAddress,
          qty: stSplitDetails[key],
        });
      }
    }
    // console.log(':: this.splitDetailsfields :: ', this.splitDetailsfields);
    if (this.splitDetailsfields[0]?.market && this.splitDetailsfields[0]?.qty) {
      this._manageSplitSummaryDetails(this.splitDetailsfields);
    }
  }

  _manageSplitSummaryDetails(savedDetails: any) {
    this.splitSummaryDetails = [];

    // Create a map to store details by market for quicker access
    const marketDetailsMap = new Map<string, any>();

    savedDetails?.forEach((d: any) => {
      const marketKey = d?.market?.market;

      if (!marketKey) return; // Skip if market key is not available

      if (!marketDetailsMap.has(marketKey)) {
        // If market details are not already present, initialize and add
        d.totalQty = this.data?.sDetails?.plannedQuantity || 0; // Set totalQty
        d.childMarket = [d]; // Initialize childMarket array
        marketDetailsMap.set(marketKey, d); // Add to map for future reference
        this.splitSummaryDetails.push(d); // Add to splitSummaryDetails
      } else {
        // If market details are already present, update childMarket
        const existingMarketDetails = marketDetailsMap.get(marketKey);
        if (existingMarketDetails) {
          // Check if the same market and location already exist in childMarket
          const alreadyExists = existingMarketDetails.childMarket.some(
            (child: any) => {
              return (
                child.market.locationName === d.market.locationName &&
                child.market.market === d.market.market
              );
            }
          );
          if (!alreadyExists) {
            d.childMarket = null;
            existingMarketDetails.childMarket.push(d); // Add to childMarket array
          } else {
            this.showToast("Market with this location already exist");
          }
        }
      }
    });
    let tQty =0;
    this.splitSummaryDetails.forEach((details: any) => {
      let locationTotalQty = 0;
      details?.childMarket?.forEach((market: any) => {
        locationTotalQty += parseInt(market?.qty);
      });
      if (locationTotalQty > 0) {
        details.locationTotalQty = locationTotalQty;
        tQty += locationTotalQty; 
        details.totalPercentage = (
          (locationTotalQty / this.data?.sDetails?.plannedQuantity) *
          100
        ).toFixed(2);
      }
    });
    this.totalQty = tQty;
    if(tQty > this.data?.sDetails?.plannedQuantity){
      this.showToast("Qty Exced Max Planned Qty")
    }
    console.log("this.splitSummaryDetails", this.splitSummaryDetails);
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
          exwSgdCost: this.exwSgdCost,
        });
        this.cartItems.push({
          ...obj,
          exwSgdCost: this.exwSgdCost,
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
        if (checked) {
          v.itemAlreadySelected = true;
        } else {
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
    this.splitDetailsfields.push({ market: "", qty: "" });
  }

  removeRow(index: number) {
    // let findIndex = this.splitSummaryDetails?.find((s: any) => s.market.market === this.splitDetailsfields[index]?.market?.market);
    this.splitDetailsfields.splice(index, 1);
    // this.splitSummaryDetails.splice(findIndex, 1);
  }

  saveCurrentValue() {
    this.data.vList(this.splitDetailsfields);
    this._manageSplitSummaryDetails(this.splitDetailsfields);
  }

  manageToggle(index: number) {
    let getIndex = this.childCaseIds.findIndex((n: number) => n === index);
    getIndex === -1
      ? this.childCaseIds.push(index)
      : this.childCaseIds.splice(index, 1);
  }

  replaceUnderscores(name: string) {
    return name?.replace(/_/g, " - ");
  }

  showToast(msg: string) {
    this.toastService.open({
      value: [
        {
          severity: "error",
          content: msg,
        },
      ],
      life: 2000,
    });
  }
}
