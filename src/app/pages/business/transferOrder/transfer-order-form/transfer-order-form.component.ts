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
  projectFormData:any = {
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
  stVariants: any = [];
  
  customStylesDC = {
    position: 'absolute',
    marginTop: '-222px',
    marginLeft: '120px',
    width: '20%',
  };
  customStylesStore= {
    position: 'absolute',
    width: '20%',
    marginTop: '-157px',
    marginLeft: '120px',
  };
  detailsInputs:any = [
    {
      variantId: 'p?.variantId',
      skuNo: 'p?.sku',
      plannedQuantity: null,
      alreadyAdded: false
    },
    {
      variantId: 'p?.variantId',
      skuNo: 'p?.sku',
      plannedQuantity: null,
      alreadyAdded: false
    }
  ];

  discrepancyValues:any = ['ORIGIN', 'DESTINATION'];

  dObj:any = {
    details: [
      {
        discrepancyFlag: false,
        discrepancyResolvedTo: "",
        lineNumber: 0
      }
    ]
  }

  config = {
    id: 'dialog-service',
    width: '50%',
    maxHeight: '600px',
    title: 'Select Produts With Style',
    content: TransferOrderFormModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(''),
    data: {
      name: 'Tom',
      age: 10,
      address: 'Chengdu',
    },
  };

  toTypeLabel:string = 'Origin To Destination';
  todayDate:any = new Date();
  dDate:any = new Date();
  paramId: string = "";
  connectionLocationList: any[] = [];
  selectedTransferOrder: any = {};
  allowSubmit: boolean = true;
  expectedDeliveryDateDisabled: boolean = false;
  expectedArrivalDateDisabled: boolean = false;

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
      if(res.status?.toLowerCase() !== "draft"){
        this.expectedDeliveryDateDisabled = true;
        this.expectedArrivalDateDisabled = true;
      }
      
      this.selectedTransferOrder = res;
      this.projectFormData = res;

      let expectedArrivalDate = this.projectFormData?.expectedArrivalDate?.split('T');
      let expectedDeliveryDate = this.projectFormData?.expectedDeliveryDate?.split('T');
      this.projectFormData.expectedArrivalDate = expectedArrivalDate ? expectedArrivalDate[0]:'';
      this.projectFormData.expectedDeliveryDate = expectedDeliveryDate ? expectedDeliveryDate[0]:'';

      this.toTypeLabel = this.projectFormData?.originLocation?.nodeType+ ' To ' +this.projectFormData?.destinationLocation?.nodeType;
      this.detailsInputs = this.projectFormData?.details?.map((d: any) => {
        return {
          variantId: d?.variantId,
          skuNo: d?.skuNo,
          plannedQuantity: d?.plannedQuantity,
          skuDescription: d?.skuDescription,
          receivedQuantity: d?.receivedQuantity,
          sentQuantity: d?.sentQuantity,
          discrepancyResolvedTo: d?.discrepancyResolvedTo,
          lineNumber: d?.lineNumber,
          discrepancyFlag: d?.discrepancyFlag,
          alreadyAdded: true
        }
      })

      this.detailsInputs?.sort((a: any, b: any) => {
        let fVal = parseInt(a.lineNumber);
        let sVal = parseInt(b.lineNumber);
        return fVal > sVal ? 1 : fVal < sVal ? -1:0;
      })
    });
  }

  submitProjectForm(event: any) {
    if (event?.valid) {
      if (this.mode === "Add") {
        const destinationId = this.projectFormData.destinationLocation.connectionLocationId;
        const originId = this.projectFormData.originLocation.connectionLocationId;

        delete this.projectFormData.destinationLocation?.nodeType;
        delete this.projectFormData.originLocation?.nodeType;

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
        this.detailsInputs?.forEach((e: any, key: any) => {
          e['lineNumber'] = parseInt(key+1)
        });
        this.projectFormData.details = this.detailsInputs;
        this.projectFormData.expectedArrivalDate = this.projectFormData.expectedArrivalDate+'T00:00:00Z';
        this.projectFormData.expectedDeliveryDate = this.projectFormData.expectedDeliveryDate+'T00:00:00Z';
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
            results.modalInstance.hide();
            this.detailsInputs = [];
            this.stVariants?.forEach((p: any) => {
              if(p?.selected === true) {
                this.detailsInputs.push({
                  variantId: p?.variantId,
                  skuNo: p?.sku,
                  plannedQuantity: null,
                  alreadyAdded: false
                })
              }
            });
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: (variantList: any) => {
            this.stVariants = [];
            this.detailsInputs = [];
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        vList: (vData: any) => {
          this.stVariants = vData;
          this.detailsInputs = [];
        }
      },
    });
  }

  updateValue(event: any, keyName: string, index: number) {
    this.detailsInputs[index][keyName] = event.target.value;
  }

  _checkIfValid() {
    return this?.detailsInputs?.findIndex((p: any) => (!p?.variantId || !p?.skuNo || !p?.plannedQuantity)) === -1;
  }

  updateStatus(type: string) {
    this.transferOrderService
    .updateStatus({
      id: this.paramId, 
      formData: this.projectFormData,
      type: type
    })
    .subscribe((res) => {
      let type;
      let msg;
      this.getTransferOrderById(this.paramId)
      if(res) {
        type = "success";
        msg = "Data Updated Successfully"
        
      } else {
        type= "error";
        msg = MSG.error;
      }
      this._showToastMsg(type, msg);
    });
  }

  confirmNow(rowIndex: number) {
    this.dObj.details = [];
    this.dObj.details.push({
      discrepancyFlag: this.detailsInputs[rowIndex]?.discrepancyFlag,
      discrepancyResolvedTo: this.detailsInputs[rowIndex]?.discrepancyResolvedTo,
      lineNumber: this.detailsInputs[rowIndex]?.lineNumber
    });
    this.transferOrderService
    .updateStatus({
      id: this.paramId, 
      formData: this.dObj
    })
    .subscribe((res) => {
      let type;
      let msg;
      this.getTransferOrderById(this.paramId)
      if(res) {
        type = "success";
        msg = MSG.update
        
      } else {
        type= "error";
        msg = MSG.error;
      }
      this._showToastMsg(type, msg);
    });
  }

  removeNow(rowIndex: number) {
    this.detailsInputs?.splice(rowIndex, 1);
  }
  
}
