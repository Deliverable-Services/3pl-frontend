import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductsListDataService } from 'src/app/@core/mock/products-data.service';
import { InventoryService } from 'src/app/@core/mock/inventory.service';

@Component({
  selector: 'app-transfer-order-form-modal',
  templateUrl: './transfer-order-form-modal.component.html',
  styleUrls: ['./transfer-order-form-modal.component.scss']
})
export class TransferOrderFormModalComponent {

  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();


  filteredData : any[] = [];
  variantList : any[] = [];
  selectedVariants: any[] = [];
  searchWithStyleName:any = {
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

  close($event:any) {
    this.modalClosed.emit(this.variantList);
    this.handler($event);
  }

  storeObjectData(obj: any) {
    // Check if the object is selected or deselected
    if (obj.selected) {
      // Store the object's data in the selectedObjects array
      this.selectedVariants.push(obj);
    } else {
      // Remove the object from the selectedVariants array if deselected
      const index = this.selectedVariants.findIndex(item => item === obj);
      if (index !== -1) {
        this.selectedVariants.splice(index, 1);
      }
    }
    this.data.vList(this.variantList);
  }

  search(e: any) {
    // return from here if length is not three
    if(e.target.value?.length < 3) return;
    
    this.searchWithStyleName.keyword = e.target.value;
    this.productsListDataService.setSearchParams(this.searchWithStyleName)
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
    
    if(this.selectedItem){
      this.productsListDataService.getById(this.selectedItem).subscribe((res) => {
        res.variants.forEach((variant:any) =>{
            variant.desc = res.logisticsDesc;
        });
        this.variantList = res.variants;
        // start inventory search
        this.getInventory(this.variantList?.map((v: any) => v.sku), '');        
    }); 
    }   
  }

  getInventory($sku: any, originId: string) {
    let skuList:any[] = [];
    skuList.push({
      field: "sku",
      operator: "in",
      value: $sku,
    });
    this.inventoryService.getList(skuList).subscribe((i: any) => console.log(' inventory => ', i));
  }
}
