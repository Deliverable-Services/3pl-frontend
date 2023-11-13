import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { ShippingOrderService } from "src/app/@core/mock/shipping-order.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { MSG } from "src/config/global-var";
import { PurchaseOrderService } from "src/app/@core/mock/purchase-order.service";
import { ShipmentAndShippingFormModalComponent } from "../shipment-and-shipping-form-modal/shipment-and-shipping-form-modal.component";
import { PackagesFormModalComponent } from "../packages-form-modal/packages-form-modal.component";
import { BulkPackFormModalComponent } from "../bulk-pack-form-modal/bulk-pack-form-modal.component";

@Component({
  selector: "app-shipment-and-shipping-form",
  templateUrl: "./shipment-and-shipping-form.component.html",
  styleUrls: ["./shipment-and-shipping-form.component.scss"],
})
export class ShipmentAndShippingFormComponent implements OnInit {
  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  createdDate? = "";
  modifiedDate? = "";
  vendorList: any[] = [];

  projectFormData: any = {
    shipToLocation: {
      connectionLocationId: "",
      nodeName: "",
      nodeType: "",
      physicalAddress: ""
    },
    vendor: {
      id: "",
      companyName: "",
      address: "",
      creditTermsDto: {
        creditTermsId: ""
      }
    },
    shipToAddress: "",
    details: [],
    remark: "",
  };
  stVariants: any = [];
  locationID: string = "";

  packageInfo: any[] = [];
  bulkDetailsInfo: any;
  selectedPoDetails: any;
  cartonInfo: any = {};
  packageDetailsInfo: any;
  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "nodeType",
    sortDir: "asc",
  };

  customStylesDC = {
    position: "absolute",
    marginTop: "-222px",
    marginLeft: "120px",
    width: "20%",
  };
  customStylesStore = {
    position: "absolute",
    width: "20%",
    marginTop: "-157px",
    marginLeft: "120px",
  };
  detailsInputs: any = [];

  errorCounter = {
    count: 0,
    ids: [] as string[],
  };

  discrepancyValues: any = ["ORIGIN", "DESTINATION"];

  dObj: any = {
    details: [
      {
        discrepancyFlag: false,
        discrepancyResolvedTo: "",
        lineNumber: 0,
      },
    ],
  };

  config = {
    id: "dialog-service",
    width: "50%",
    maxHeight: "600px",
    title: "Select Produts from PO",
    content: ShipmentAndShippingFormModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(""),
  };

  packageConfig = {
    id: "dialog-service",
    width: "50%",
    maxHeight: "600px",
    title: "Carton Details",
    content: PackagesFormModalComponent,
    backdropCloseable: true,
    onClose: () => console.log("")
  };

  bulkConfig = {
    id: "dialog-service",
    width: "50%",
    maxHeight: "600px",
    content: BulkPackFormModalComponent,
    backdropCloseable: true,
    onClose: () => console.log("")
  };

  toTypeLabel: string = "Origin To Destination";
  todayDate: any = new Date();
  addedVariantIds: any = [];
  dDate: any = new Date();
  paramId: string = "";
  connectionLocationList: any[] = [];
  selectedTransferOrder: any = {};
  allowSubmit: boolean = true;
  expectedDeliveryDateDisabled: boolean = false;
  expectedArrivalDateDisabled: boolean = false;

  constructor(
    private shippingOrderService: ShippingOrderService,
    private vendorListDataService: VendorListDataService,
    private connectionLocationService: ConnectionLocationService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private toastService: ToastService,
    private purchaseOrderService: PurchaseOrderService
  ) {}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    this.getConnectionLocationList();
    if (this.mode === "Edit") {
      this.getTransferOrderById(this.paramId);
    }

    this.connectionLocationService.setPageParams(this.pageParam);
    this.getVendorList();

    this.purchaseOrderService.setPageParams({
      pageNo: "",
      pageSize: '100',
      sortBy: "",
      sortDir: "",
    });
  }

  getPoList(poIds: any) {
    this.purchaseOrderService.getTransferOrderList({
      filters: [{
        field: 'id',
        operator: "in",
        value: poIds,
      }]
    })
      .subscribe((res) => {
        this.detailsInputs.forEach((d: any) => {
          let getPoInfo = res?.content?.find((p: any) => p.id === d.poId);
          let skuInfo = getPoInfo?.details?.find((s: any) => (s.variantId === d.variantId && s.skuNo === d.skuNo));
          console.log(':: skuInfo :: ', skuInfo)
          d.remainingQuantity = skuInfo?.poQuantity ? (skuInfo.poQuantity - (skuInfo.lockedQuantity+skuInfo.receivedQuantity)):0
        })
      });
  }

  getConnectionLocationList() {
    this.connectionLocationService.getList().subscribe(
      (res) => {
        this.connectionLocationList.push({
          connectionLocationId: "",
          nodeName: "ALL",
        });

        this.connectionLocationList = res?.filter(
          (c: any) => c?.nodeType?.toLowerCase() === "dc"
        );
        this.connectionLocationList = this.connectionLocationList?.map(
          (c: any) => {
            return {
              connectionLocationId: c?.connectionLocationId || "",
              nodeName: `${c?.nodeType} - ${c?.nodeName}` || "",
              nodeType: c?.nodeType,
              physicalAddress: c.physicalAddress
            };
          }
        );
      },
      (error) => {
        this._showDateToast(error.error.detail);
      }
    );
  }

  validateSelection() {
    const destinationId =
      this.projectFormData.destinationLocation.connectionLocationId;
    const originId = this.projectFormData.originLocation.connectionLocationId;

    if (destinationId !== "" && originId !== "") {
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Handle invalid date string
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  getTransferOrderById(id: string) {
    this.shippingOrderService.getById(id).subscribe(
      (res) => {
        this.createdDate = this.formatDate(res.createdDate) ?? "";
        this.modifiedDate = this.formatDate(res.lastModifiedDate) ?? "";

        this.selectedTransferOrder = res;
        this.projectFormData = res;
        
        let expectedArrivalDate =
          this.projectFormData?.dueDate?.split("T");
        let expectedDeliveryDate =
          this.projectFormData?.issueDate?.split("T");
        this.projectFormData.dueDate = expectedArrivalDate
          ? expectedArrivalDate[0]
          : "";
        this.projectFormData.issueDate = expectedDeliveryDate
          ? expectedDeliveryDate[0]
          : "";

        this.detailsInputs = this.projectFormData?.details?.map((d: any) => {
          return {
            poId: d?.poId,
            variantId: d?.variantId,
            skuNo: d?.skuNo,
            remainingQuantity: d?.poQuantity ? (d.poQuantity - (d.lockedQuantity+d.receivedQuantity)):0,
            skuDescription: d?.skuDescription,
            shippedQuantity: d?.shippedQuantity,
            receivedQuantity: d?.receivedQuantity ? d?.receivedQuantity : 0,
            poDetailsId: d?.poDetailsId
          };
        });

        let stPoIds = this.detailsInputs?.map((d: any) => d.poId);
        this.getPoList(stPoIds);

        this.detailsInputs?.sort((a: any, b: any) => {
          let fVal = parseInt(a.lineNumber);
          let sVal = parseInt(b.lineNumber);
          return fVal > sVal ? 1 : fVal < sVal ? -1 : 0;
        });

        this.packageDetailsInfo = this.projectFormData.packages;

        // console.log(':: this.packageDetailsInfo :: ', this.packageDetailsInfo)
      },
      (error) => {
        this._showDateToast(error.error.detail);
      }
    );
  }

  _validateFormInputs() {
    if(!this.detailsInputs?.length) {
      this._showError('Please add atleast one product!');
      return false;
    } else if((!this.projectFormData.status || this.projectFormData.status?.toLowerCase() === 'draft')
      && this.detailsInputs?.filter((p: any) => p.shippedQuantity > p.remainingQuantity)?.length) {
      this._showError('Planned Ship Qty cannot be greater than Remaining Qty!');
      return false;
    } else if(this.detailsInputs?.filter((p: any) => !p.shippedQuantity)?.length) {
      this._showError('One or more field is required!');
      return false;
    }
    return true;
  }

  _showError(eMsg: string) {
    this.toastService.open({
      value: [{
          severity: "error",
          content: eMsg,
        }],
      life: 2000,
    });
  }

  submitProjectForm(event: any) {
    if (event?.valid) {
      if(!this._validateFormInputs()) return;
      this.detailsInputs?.forEach((e: any, key: any) => {
        e["lineNumber"] = parseInt(key + 1);
        e["plannedQuantity"] = parseInt(e["plannedQuantity"]);
      });
      this.projectFormData.details = this.detailsInputs;
    
      if (this.mode === "Add") {
        this.shippingOrderService
            .add({
              ...this.projectFormData,
              shipToLocation: {
                connectionLocationId: this.projectFormData.shipToLocation.connectionLocationId
              },
              vendor: {
                id: this.projectFormData.vendor.id
              }
            })
            .subscribe(
              (res) => {
                this._showToast(res);
              },
              (error) => {
                this._showDateToast(error.error.detail);
              }
            );
      } else {
        const today = new Date();
        const expectedArrivalDate = new Date(
          this.projectFormData.dueDate
        );
        const expectedDeliveryDate = new Date(
          this.projectFormData.issueDate
        );

        // Set the time components to 00:00:00
        today.setHours(0, 0, 0, 0);
        expectedArrivalDate.setHours(0, 0, 0, 0);
        expectedDeliveryDate.setHours(0, 0, 0, 0);

        const secondsToday = Math.floor(today.getTime() / 1000);
        const secondsExpectedArrival = Math.floor(
          expectedArrivalDate.getTime() / 1000
        );
        const secondsExpectedDelivery = Math.floor(
          expectedDeliveryDate.getTime() / 1000
        );

        if (secondsExpectedDelivery < secondsToday) {
          this._showDateToast(
            "Expected delivery date should be greater than or equal to today"
          );
          return;
        }
        if (secondsExpectedArrival < secondsExpectedDelivery) {
          this._showDateToast(
            "Expected arrival date should be greater than or equal to expected delivery date"
          );
          return;
        }
        this.shippingOrderService
          .updateTransferOrder(this.paramId, this.projectFormData)
          .subscribe(
            (res) => {
              this._showToast(res);
            },
            (error) => {
              this._showDateToast(error.error.detail);
            }
          );
      }
    }
  }

  _showDuplicatToast() {
    this.toastService.open({
      value: [
        {
          severity: "error",
          content: "Destionation and Origin Cannot be Same",
        },
      ],
      life: 2000,
    });
  }

  _showDateToast(message: string) {
    this.toastService.open({
      value: [{ severity: "error", content: message }],
      life: 2000,
    });
  }

  _showToast(resp: any) {
    let type, msg;
    if (resp) {
      type = "success";
      msg = this.mode === "Add" ? MSG.create : MSG.update;
      if (this.mode === "Add") {
        this.router.navigate(["/business/shipment-and-shipping"]);
      } else {
        this.getTransferOrderById(this.paramId);
      }
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
    if (
      this.projectFormData?.originLocation?.nodeType &&
      this.projectFormData?.destinationLocation?.nodeType
    ) {
      if (
        this.projectFormData?.originLocation?.nodeType?.toLowerCase() ===
          "dc" &&
        this.projectFormData?.destinationLocation?.nodeType?.toLowerCase() ===
          "dc"
      ) {
        this.allowSubmit = false;
        this._showToastMsg(
          "error",
          "Selected origin to destionation combination is not allowed!"
        );
      }
    }
  }

  _showToastMsg(type: string, msg: string) {
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
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: (variantList: any) => {
            results.modalInstance.hide();
            this.stVariants?.forEach((p: any) => {
              if (
                p?.selected === true &&
                !this.addedVariantIds.includes(p?.variantId) &&
                !this.detailsInputs.some((input: any) => input.variantId === p?.variantId)
              ) {
                this.detailsInputs.push({
                  poId: p?.selectedPoId,
                  poDetailsId: p?.id,
                  variantId: p?.variantId,
                  skuNo: p?.skuNo,
                  remainingQuantity: p?.poQuantity ? (p.poQuantity - (p.lockedQuantity+p.receivedQuantity)):0,
                  skuDescription: p?.skuDescription,
                  shippedQuantity: null
                });

                // Add the variantId to the addedVariantIds array
                this.addedVariantIds.push(p?.variantId);
              }
            });
          },
        },
        {
          id: "btn-cancel",
          cssClass: "common",
          text: "Cancel",
          handler: (variantList: any) => {
            // this.stVariants = [];
            // this.detailsInputs = [];
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        info: this.projectFormData,
        vList: (vData: any) => {
          this.stVariants = vData;
          if (this.mode === "Edit") {
          }
          this.detailsInputs;
          // this.detailsInputs = [];
        },
        // origin: this.projectFormData.originLocation.connectionLocationId,
      },
    });
  }

  openPackageDialog(dialogtype?: string, showAnimation?: boolean) {
    const results = this.dialogService.open({
      ...this.packageConfig,
      dialogtype: dialogtype,
      showAnimation: showAnimation,
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: (variantList: any) => {
            if(!this.cartonInfo.length || !this.cartonInfo.width
              || !this.cartonInfo.height || !this.cartonInfo.grossWeight
              || !this.cartonInfo.netWeight) {
                this._showError('One or more field is required!');
                return;
              }
            results.modalInstance.hide();
            this.packageDetailsInfo = this.cartonInfo;
            this.packageDetailsInfo['details'] = this.packageInfo?.map((p: any) => {
              return {
                packageQuantity: p?.packageQuantity,
                variant: {
                  sku: p?.addtionalDetails?.skuNo,
                  variantId: p?.variantId
                }
              }
            });
            this.addPackage([this.packageDetailsInfo]);
          },
        },
        {
          id: "btn-cancel",
          cssClass: "common",
          text: "Cancel",
          handler: (variantList: any) => {
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        info: this.projectFormData,
        vList: (vData: any) => {
          this.packageInfo = vData;
        },
        cartonDetails: (cData: any) => {
          this.cartonInfo = cData;
        },
        // origin: this.projectFormData.originLocation.connectionLocationId,
      },
    });
  }

  openBulkPack(dialogtype?: string, showAnimation?: boolean) {
    const results = this.dialogService.open({
      ...this.bulkConfig,
      dialogtype: dialogtype,
      showAnimation: showAnimation,
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: (variantList: any) => {
            if(!this.bulkDetailsInfo?.length || !this.bulkDetailsInfo?.width
              || !this.bulkDetailsInfo?.height || !this.bulkDetailsInfo?.grossWeight
              || !this.bulkDetailsInfo?.netWeight) {
                this._showError('One or more field is required!');
                return;
              }
            results.modalInstance.hide();
            let preparePayload = [];
            for (let i=0; i<this.bulkDetailsInfo.noOfCarton; i++) {
              preparePayload.push({
                ctnCode: this.bulkDetailsInfo?.ctnCode,
                ctnNo: this.bulkDetailsInfo?.ctnNo,
                length: this.bulkDetailsInfo?.length,
                width: this.bulkDetailsInfo?.width,
                height: this.bulkDetailsInfo?.height,
                cbm: this.bulkDetailsInfo?.cbm,
                grossWeight: this.bulkDetailsInfo?.grossWeight,
                netWeight: this.bulkDetailsInfo?.netWeight,
                details: [{
                  packageQuantity: this.bulkDetailsInfo?.qtyInOne,
                  variant: {
                    sku: this.selectedPoDetails?.skuNo,
                    variantId: this.selectedPoDetails?.variantId
                  }
                }]
              });
            }
            this.addPackage(preparePayload);
          },
        },
        {
          id: "btn-cancel",
          cssClass: "common",
          text: "Cancel",
          handler: (variantList: any) => {
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        info: this.projectFormData,
        packageDetailsInfo: this.packageDetailsInfo,
        vList: (vData: any) => {
          this.selectedPoDetails = vData;
        },
        cartonDetails: (cData: any) => {
          this.bulkDetailsInfo = cData;
        },
        // origin: this.projectFormData.originLocation.connectionLocationId,
      },
    });
  }

  updateCartonDetails(event: any, keyName: string, index: number) {
    this.packageDetailsInfo[index][keyName] = event.target.value;
  }

  updateValue(event: any, keyName: string, index: number) {
    this.detailsInputs[index][keyName] = event.target.value;
    let idToCheck = this.detailsInputs[index]["variantId"] as string;
    if (keyName === "sentQuantity") {
      if (
        parseInt(this.detailsInputs[index][keyName]) >
        parseInt(this.detailsInputs[index]["plannedQuantity"])
      ) {
        if (!this.errorCounter.ids.includes(idToCheck)) {
          this.errorCounter.ids.push(idToCheck);
          this.errorCounter.count = this.errorCounter.count + 1;
        }
        this.detailsInputs[index]["sentCheck"] = true;
      } else {
        if (this.errorCounter.ids.includes(idToCheck)) {
          const index = this.errorCounter.ids.indexOf(idToCheck);
          if (index !== -1) {
            this.errorCounter.ids.splice(index, 1);
          }
          this.errorCounter.count = this.errorCounter.count - 1;
        }
        this.detailsInputs[index]["sentCheck"] = false;
      }
    }

    if (keyName === "receivedQuantity") {
      if (
        parseInt(this.detailsInputs[index][keyName]) >
        parseInt(this.detailsInputs[index]["sentQuantity"])
      ) {
        if (!this.errorCounter.ids.includes(idToCheck)) {
          this.errorCounter.ids.push(idToCheck);
          this.errorCounter.count = this.errorCounter.count + 1;
        }
        this.detailsInputs[index]["receivedCheck"] = true;
      } else {
        if (this.errorCounter.ids.includes(idToCheck)) {
          const index = this.errorCounter.ids.indexOf(idToCheck);
          if (index !== -1) {
            this.errorCounter.ids.splice(index, 1);
          }
          this.errorCounter.count = this.errorCounter.count - 1;
        }
        this.detailsInputs[index]["receivedCheck"] = false;
      }
    }
  }

  _checkIfValid() {
    return (
      this?.detailsInputs?.findIndex(
        (p: any) => !p?.variantId || !p?.skuNo || !p?.plannedQuantity
      ) === -1
    );
  }

  updateStatus(type: string) {
    if (type === "publish" && this.detailsInputs.length === 0) {
      this._showToastMsg("error", "Please add details to publish");
      return;
    }
    let searchString = "T00:00:00Z"; // The string to search for
    // Check if the searchString exists in the date strings
    if (!this.projectFormData.dueDate.includes(searchString)) {
      this.projectFormData.dueDate =
        this.projectFormData.dueDate + "T00:00:00Z";
    }
    if (!this.projectFormData.issueDate.includes(searchString)) {
      this.projectFormData.issueDate =
      (this.projectFormData.issueDate ? this.projectFormData.issueDate:'2023-10-20') + "T00:00:00Z";
    }

    this.detailsInputs?.forEach((e: any, key: any) => {
      e["lineNumber"] = parseInt(key + 1);
      e["plannedQuantity"] = parseInt(e["plannedQuantity"]);
      // e["sentQuantity"] = parseInt(e["sentQuantity"]);
      // e["receivedQuantity"] = parseInt(e["receivedQuantity"]);
      // if (e["sentQuantity"] > e["plannedQuantity"]) {
      //   this._showToastMsg(
      //     "error",
      //     "Sent Quantity should be less than or equal to planned Quantity"
      //   );
      //   return;
      // }
      // if (e["receivedQuantity"] > e["sentQuantity"]) {
      //   this._showToastMsg(
      //     "error",
      //     "Received Quantity should be less than or equal to sent Quantity"
      //   );
      //   return;
      // }
    });
    this.projectFormData.details = this.detailsInputs;

    this.shippingOrderService
      .updateStatus({
        id: this.paramId,
        formData: this.projectFormData,
        type: type,
      })
      .subscribe(
        (res) => {
          let type;
          let msg;
          this.getTransferOrderById(this.paramId);
          if (res) {
            type = "success";
            msg = "Data Updated Successfully";
          } else {
            type = "error";
            msg = MSG.error;
          }
          this._showToastMsg(type, msg);
        },
        (error) => {
          this._showDateToast(error.error.detail);
        }
      );
  }

  confirmNow(rowIndex: number, locationID: any) {
    this.dObj.details = [];
    if (this.detailsInputs[rowIndex]?.discrepancyResolvedTo === "NONE") {
      this._showToastMsg(
        "error",
        "Please Select Discrepancy Resolved To Other Than None"
      );
      return;
    }
    this.dObj.details.push({
      discrepancyFlag: this.detailsInputs[rowIndex]?.discrepancyFlag,
      discrepancyResolvedTo:
        this.detailsInputs[rowIndex]?.discrepancyResolvedTo,
      lineNumber: this.detailsInputs[rowIndex]?.lineNumber,
      locationId: locationID ? locationID : null,
    });
    this.shippingOrderService
      .updateStatus({
        id: this.paramId,
        formData: this.dObj,
        type: "resolve-discrepancy",
      })
      .subscribe(
        (res) => {
          let type;
          let msg;
          this.getTransferOrderById(this.paramId);
          if (res) {
            type = "success";
            msg = MSG.update;
          } else {
            type = "error";
            msg = MSG.error;
          }
          this._showToastMsg(type, msg);
        },
        (error) => {
          this._showDateToast(error.error.detail);
        }
      );
  }

  removeNow(rowIndex: number) {
    this.detailsInputs?.splice(rowIndex, 1);
    this.addedVariantIds?.splice(rowIndex,1);
  }

  confirmDialog(type: string) {
    if(!this._validateFormInputs()) return;
    let stType = type;
    this.showConfirmation('updateDetails', stType);
  }

  confirm(rowIndex: number) {
    let stType = rowIndex;
    let displayContent = "block"; // Default to "block"
    if (this.detailsInputs[rowIndex]?.discrepancyResolvedTo == "ORIGIN") {
      if (this.projectFormData.originLocation.nodeType == "Store") {
        displayContent = "none";
      }
    } else if (
      this.detailsInputs[rowIndex]?.discrepancyResolvedTo == "DESTINATION"
    ) {
      if (this.projectFormData.destinationLocation.nodeType == "Store") {
        displayContent = "none";
      }
    } else {
      displayContent = "none";
      this._showToastMsg(
        "error",
        "Please Select Discrepancy Resolved To Other Than None"
      );
      return;
    }

    let htmlString = `
      <div style="display:${displayContent}">
        <d-form-label [required]="true" [hasHelp]="false" [helpTips]="'This is the Credit Day.'">Enter Location ID</d-form-label>
        <input type="text" id="inputField" [(ngModel)]="locationID" [dValidateRules]="{
          validators: [{ required: true }]
        }" />
      </div>`;

    const results = this.dialogService.open({
      id: "dialog-service",
      width: "346px",
      maxHeight: "600px",
      title: "Are you sure?",
      content: htmlString,
      html: true,
      backdropCloseable: true,
      dialogtype: "",
      onClose: () => {},
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          handler: ($event: Event) => {
            const inputValue = document.getElementById(
              "inputField"
            ) as HTMLInputElement;
            if (displayContent === "block") {
              if (inputValue.value.trim() !== "") {
                // Check if input is not empty
                results.modalInstance.hide();
                this.confirmNow(stType, inputValue.value);
              } else {
                this._showToastMsg("error", "Please Enter Location ID");
              }
            } else {
              results.modalInstance.hide();
              this.confirmNow(stType, inputValue.value);
            }
          },
        },
        {
          id: "btn-cancel",
          cssClass: "common",
          text: "Cancel",
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getVendorList() {
    this.vendorListDataService
      .getVendorList({
        pageNo: "",
        pageSize: "100",
        sortBy: "",
        sortDir: "",
      })
      .subscribe((res: any) => {
        this.vendorList = res?.content?.map((v: any) => {
          return {
            companyName: v.companyName,
            address: v.address,
            id: v.id,
            creditTermsDto: {
              creditTermsId: v.creditTermsDto.creditTermsId
            }
          }
        })
      });
  }

  setAddress(address: string, fValue: string) {
    this.projectFormData[fValue] = address;
  }

  _dateVaidationForToday() {
    let dtToday = new Date();
    
    let month:any = dtToday.getMonth() + 1;
    let day:any = dtToday.getDate();
    let year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    return year + '-' + month + '-' + day;
  }

  addPackage(formData: any) {
    this.shippingOrderService.addPackage(formData, this.paramId)
    .subscribe(
      (res) => {
        this._showToast(res);
      },
      (error) => {
        this._showDateToast(error.error.detail);
      }
    );
  }

  deletePackage(ctnCode: string) {
    this.showConfirmation('deletePackage', ctnCode);
  }

  showConfirmation(cTYpe: string, stType: any) {
    const results = this.dialogService.open({
      id: "dialog-service",
      width: "346px",
      maxHeight: "600px",
      title: "Are you sure?",
      content: "",
      backdropCloseable: true,
      dialogtype: "",
      onClose: () => {},
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: ($event: Event) => {
            results.modalInstance.hide();
            if(cTYpe == 'deletePackage') {
              this._removePackage(stType);
            } else {
              this.updateStatus(stType);
            }
          },
        },
        {
          id: "btn-cancel",
          cssClass: "common",
          text: "Cancel",
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  _removePackage(ctnCode: string) {
    this.shippingOrderService
    .removePackage(ctnCode)
          .subscribe(
            (res) => {
              this._showToast(res);
            },
            (error) => {
              this._showDateToast(error.error.detail);
            }
          );
  }
}
