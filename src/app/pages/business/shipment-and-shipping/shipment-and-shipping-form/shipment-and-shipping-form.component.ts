import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { ShippingOrderService } from "src/app/@core/mock/shipping-order.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { MSG } from "src/config/global-var";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
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
    remarks: "",
  };
  stVariants: any = [];
  locationID: string = "";

  packageInfo: any[] = [];
  cartonInfo: any = {};
  packageDetailsInfo: any[] = [];
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
    width: "70%",
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
    title: "Select Product from Shipment",
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
    private toastService: ToastService
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
        // if (res?.status?.toLowerCase() !== "draft") {
        //   this.expectedDeliveryDateDisabled = true;
        //   this.expectedArrivalDateDisabled = true;
        // }

        // console.log(':: :: ', res);

        this.createdDate = this.formatDate(res.createdDate) ?? "";
        this.modifiedDate = this.formatDate(res.lastModifiedDate) ?? "";

        this.selectedTransferOrder = res;
        this.projectFormData = res;
        // this.projectFormData.originLocation.nodeName = `${this.projectFormData.originLocation.nodeType} - ${this.projectFormData.originLocation.nodeName}`;
        // this.projectFormData.destinationLocation.nodeName = `${this.projectFormData.destinationLocation.nodeType} - ${this.projectFormData.destinationLocation.nodeName}`;

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
            poDetailsId: d?.poDetailsId
          };
        });

        this.detailsInputs?.sort((a: any, b: any) => {
          let fVal = parseInt(a.lineNumber);
          let sVal = parseInt(b.lineNumber);
          return fVal > sVal ? 1 : fVal < sVal ? -1 : 0;
        });

        // console.log(':: :: ', this.projectFormData)
      },
      (error) => {
        this._showDateToast(error.error.detail);
      }
    );
  }

  submitProjectForm(event: any) {
    if (event?.valid) {
      // this.detailsInputs?.forEach((e: any, key: any) => {
      //   e["lineNumber"] = parseInt(key + 1);
      // });

      this.detailsInputs?.forEach((e: any, key: any) => {
        e["lineNumber"] = parseInt(key + 1);
        // e["sentQuantity"] = parseInt(e["sentQuantity"]);
        e["plannedQuantity"] = parseInt(e["plannedQuantity"]);
        // e["receivedQuantity"] = parseInt(e["receivedQuantity"]);
      });
      this.projectFormData.details = this.detailsInputs;
    
      // let searchString = "T00:00:00Z"; // The string to search for
      // Check if the searchString exists in the date strings
      // if (!this.projectFormData?.dueDate?.includes(searchString)) {
      //   this.projectFormData.dueDate =
      //     this.projectFormData.dueDate + "T00:00:00Z";
      // }
      // if (!this.projectFormData?.issueDate?.includes(searchString)) {
      //   this.projectFormData.issueDate =
      //     (this.projectFormData.issueDate ? this.projectFormData.issueDate:'2023-10-20') + "T00:00:00Z";
      // }
      if (this.mode === "Add") {
        // const destinationId =
        //   this.projectFormData.destinationLocation.connectionLocationId;
        // const originId =
        //   this.projectFormData.originLocation.connectionLocationId;

        // delete this.projectFormData.destinationLocation?.nodeType;
        // delete this.projectFormData.originLocation?.nodeType;

        // if (destinationId == originId) {
        //   this._showDuplicatToast();
        // } else {
          
        // }

        // console.log(':: :: ', {
        //   ...this.projectFormData,
        //   shipToLocation: {
        //     connectionLocationId: this.projectFormData.shipToLocation.connectionLocationId
        //   },
        //   vendor: {
        //     id: this.projectFormData.vendor.id
        //   }
        // });

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
        window.location.reload();
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
            results.modalInstance.hide();
            this.packageDetailsInfo = this.packageInfo?.map((p: any) => {
              return {
                ctnCode: this.cartonInfo?.ctnCode,
                ctnNo: this.cartonInfo?.ctnNo,
                length: this.cartonInfo?.length,
                width: this.cartonInfo?.width,
                height: this.cartonInfo?.height,
                cbm: this.cartonInfo?.cbm,
                grossWeight: this.cartonInfo?.grossWeight,
                netWeight: this.cartonInfo?.netWeight,
                productDetails: p,
                details: [{
                  packageQuantity: p?.packageQuantity,
                  variant: {
                    sku: p?.addtionalDetails?.skuNo,
                    variantId: p?.variantId
                  }
                }]
              }
            });
            console.log(':: this.stVariants ', this.packageDetailsInfo)
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
            results.modalInstance.hide();
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
          // this.packageInfo = vData;
        },
        cartonDetails: (cData: any) => {
          // this.cartonInfo = cData;
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
      // console.log("this.detailsInputs[index]", this.detailsInputs[index]);
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
      // console.log("this.detailsInputs[index]", this.detailsInputs[index]);
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
    // console.log("details", this.errorCounter);
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
    let stType = type;
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
            this.updateStatus(stType);
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
}
