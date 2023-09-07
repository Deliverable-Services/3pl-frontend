import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { TransferOrderListDataService } from "src/app/@core/mock/tranfer-order.service";
import { MSG } from "src/config/global-var";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { TransferOrderFormModalComponent } from "../transfer-order-form-modal/transfer-order-form-modal.component";

@Component({
  selector: "app-transfer-order-form",
  templateUrl: "./transfer-order-form.component.html",
  styleUrls: ["./transfer-order-form.component.scss"],
})
export class TransferOrderFormComponent implements OnInit {
  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    destinationLocation: {
      connectionLocationId: "",
      nodeName: "",
      nodeType: ""
    },
    originLocation: {
      connectionLocationId: "",
      nodeName: "",
      nodeType: ""
    },
    details: [],
    remarks: "",
    expectedArrivalDate: null,
    expectedDeliveryDate: null
  };

  toTypeLabel:string = 'Origin To Destination';
  todayDate:any = new Date();
  dDate:any = new Date();
  paramId: string = "";
  connectionLocationList: any[] = [];
  selectedTransferOrder: any = {};
  allowSubmit: boolean = true;

  constructor(
    private transferOrderService: TransferOrderListDataService,
    private connectionLocationService: ConnectionLocationService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private toastService: ToastService,
   
  ) {}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getTransferOrderById(this.paramId);
    }

    this.getConnectionLocationList();
    
  }

  getConnectionLocationList() {
    this.connectionLocationService
      .getList()
      .subscribe((res) => {
        this.connectionLocationList.push({
          connectionLocationId: "",
          nodeName:  "ALL",
        })
        this.connectionLocationList = res?.filter((c: any) => c?.nodeType?.toLowerCase() !== 'online');
        this.connectionLocationList = this.connectionLocationList?.map((c: any) => {
          return {
                connectionLocationId: c?.connectionLocationId || "",
                nodeName: c?.nodeName || "",
                nodeType: c?.nodeType,
          }
        })
      });
  }

  validateSelection() {
    const destinationId = this.projectFormData.destinationLocation.connectionLocationId;
    const originId = this.projectFormData.originLocation.connectionLocationId;
    
    if(destinationId !== "" && originId !== ""){
      if (destinationId === originId) {
        // Items are the same, disable the second select box
        return true;
      } else {
        // Items are different, enable the second select box
        return false;
      }
    }
    return false;
  }



  getTransferOrderById(id: string) {
    this.transferOrderService.getTransferOrderById(id).subscribe((res) => {
      this.selectedTransferOrder = res;
      this.projectFormData = res;
      this.toTypeLabel = this.projectFormData?.originLocation?.nodeType+ ' To ' +this.projectFormData?.destinationLocation?.nodeType;
    });
  }

  submitProjectForm(event: any) {
    if (event?.valid) {
      if (this.mode === "Add") {
        const destinationId = this.projectFormData.destinationLocation.connectionLocationId;
        const originId = this.projectFormData.originLocation.connectionLocationId;
        if(destinationId == originId){
          this._showDuplicatToast();
        }else{
          this.transferOrderService
          .addTransferOrder(this.projectFormData)
          .subscribe((res) => {
            this._showToast(res);
          });
        }
      } else {
        this.transferOrderService
          .updateTransferOrder(this.paramId, this.projectFormData)
          .subscribe((res) => {
            this._showToast(res);
          });
      }
    }
  }

  _showDuplicatToast(){
    this.toastService.open({
      value: [{ severity: "error", content: "Destionation and Origin Cannot be Same" }],
      life: 2000,
    }); 
  }

  _showToast(resp: any) {
    let type, msg;
    if (resp) {
      type = "success";
      msg = this.mode === "Add" ? MSG.create : MSG.update;
      this.router.navigate(["/business/transfer-order"]);
    } else {
      type = "error";
      msg = MSG.error;
    }
    this.toastService.open({
      value: [{ severity: type, content: msg }],
      life: 2000,
    });
  }

  checkNodeType() {
    this.allowSubmit = true;
    if(this.projectFormData?.originLocation?.nodeType
      &&this.projectFormData?.destinationLocation?.nodeType) {
        if(this.projectFormData?.originLocation?.nodeType?.toLowerCase() === 'dc' 
        && this.projectFormData?.destinationLocation?.nodeType?.toLowerCase() === 'dc') {
          this.allowSubmit = false;
          this._showToastMsg("error", "Selected origin to destionation combination is not allowed!")
        }
    }
  }

  _showToastMsg(type: string, msg: string){
    this.toastService.open({
      value: [{ severity: type, content: msg }],
      life: 2000,
    }); 
  }

  arrivalDate(event: any) {
    this.dDate = new Date(event?.selectedDate);
  }

  config = {
    id: 'dialog-service',
    width: '50%',
    maxHeight: '600px',
    title: 'Select Produts With Style',
    content: TransferOrderFormModalComponent,
    backdropCloseable: true,
    onClose: () => console.log('on dialog closed'),
    data: {
      name: 'Tom',
      age: 10,
      address: 'Chengdu',
    },
  };

  openDialog(dialogtype?: string, showAnimation?: boolean) {
    const results = this.dialogService.open({
      ...this.config,
      dialogtype: dialogtype,
      showAnimation: showAnimation,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: (variantList: any) => {
            console.log('Received variantList:', variantList);
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: (variantList: any) => {
            console.log('Received variantList:', variantList);
            results.modalInstance.hide();
          },
        },
      ],
    });
    console.log(results.modalContentInstance);
  }

  
}
