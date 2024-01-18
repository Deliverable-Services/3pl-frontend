import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, FormLayout, ToastService } from "ng-devui";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { PurchaseOrderService } from "src/app/@core/mock/purchase-order.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { MSG } from "src/config/global-var";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";
import { PurchaseOrderFormModalComponent } from "../purchase-order-form-modal/purchase-order-form-modal.component";
import { PurchaseOrderEditQtyModalComponent } from "../purchase-order-edit-qty-modal/purchase-order-edit-qty-modal.component";
import { PurchaseOrderShipmentsModalComponent } from "../purchase-order-shipments-modal/purchase-order-shipments-modal.component";
import { SplitAllocationModalComponent } from "../split-allocation-modal/split-allocation-modal.component";
import { ShippingAddressService } from "src/app/@core/mock/shipping-address.service";
import { UserManagementService } from "src/app/@core/mock/user-management.service";

@Component({
  selector: "app-purchase-order-form",
  templateUrl: "./purchase-order-form.component.html",
  styleUrls: ["./purchase-order-form.component.scss"],
})
export class PurchaseOrderFormComponent implements OnInit {
  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  createdDate? = "";
  modifiedDate? = "";
  vendorList: any[] = [];
  usersList:any[] = [];
  storeSplitDetails:any[] = [];

  selectedUser:any = {};

  projectFormData: any = {
    contactEmail: "",
    contactPhone: "",
    contactUsername: "",
    shipToLocation: {
      connectionLocationId: "",
      nodeName: "",
      nodeType: "",
      physicalAddress: "",
    },
    vendor: {
      id: "",
      companyName: "",
      address: "",
      creditTermsDto: {
        creditTermsId: "",
      },
    },
    tradeTerm: {
      creditTermsId: "",
    },
    billToAddress: "",
    shipToAddress: "",
    details: [],
    remarks: "",
    issueDate: null,
    dueDate: null,
  };
  stVariants: any = [];
  locationID: string = "";

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
    title: "Select Produts With Style",
    content: PurchaseOrderFormModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(""),
    data: {
      name: "Tom",
      age: 10,
      address: "Chengdu",
    },
  };

  shipmentConfig = {
    id: "dialog-service",
    width: "30%",
    maxHeight: "600px",
    title: "Shipment Details",
    content: PurchaseOrderShipmentsModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(""),
    data: {
      name: "Tom",
      age: 10,
      address: "Chengdu",
    },
  };

  editQtyConfig = {
    id: "dialog-service",
    width: "25%",
    maxHeight: "650px",
    content: PurchaseOrderEditQtyModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(""),
    data: {
      name: "Tom",
      age: 10,
      address: "Chengdu",
    },
  };

  splitAllocationConfig = {
    id: "dialog-service",
    width: "50%",
    maxHeight: "600px",
    content: SplitAllocationModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(""),
    data: {
      name: "Tom",
      age: 10,
      address: "Chengdu",
    },
  };

  toTypeLabel: string = "Origin To Destination";
  todayDate: any = new Date();
  addedVariantIds: any = [];
  dDate: any = new Date();
  paramId: string = "";
  connectionLocationList: any[] = [];
  shippingAddressList: any[] = [];
  selectedPurchaseOrder: any = {};
  allowSubmit: boolean = true;
  expectedDeliveryDateDisabled: boolean = false;
  expectedArrivalDateDisabled: boolean = false;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private vendorListDataService: VendorListDataService,
    private connectionLocationService: ConnectionLocationService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private toastService: ToastService,
    private shippingAddressService: ShippingAddressService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    this.getConnectionLocationList();

    this.connectionLocationService.setPageParams(this.pageParam);
    this.getVendorList();

    // this.splitAllocation('as');

    this._getShippingAddressList();
    this._getUserList();
    if (this.mode === "Edit") {
      this.getPurchaseOrderById(this.paramId);
    }
  }

  _getShippingAddressList() {
    this.shippingAddressService.getList({
      pageNo: 0,
      pageSize: 100,
      sortBy: "",
      sortDir: "",
    }).subscribe((sAddress: any) => {
      this.shippingAddressList = sAddress.content;
    });
  }

  _getUserList() {
    this.userManagementService.getList(undefined, {
      pageNo: "",
      pageSize: 100,
      sortBy: "",
      sortDir: "",
    }).subscribe((users: any) => {
      this.usersList = users?.content || [];
      if(this.usersList?.length) {
        this.selectedUser = this.usersList.find((user: any) => user.username === this.projectFormData.contactUsername);
      }
    })
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
              physicalAddress: c.physicalAddress,
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

  getPurchaseOrderById(id: string) {
    this.purchaseOrderService.getById(id).subscribe(
      (res) => {
        // if (res?.status?.toLowerCase() !== "draft") {
        //   this.expectedDeliveryDateDisabled = true;
        //   this.expectedArrivalDateDisabled = true;
        // }

        // console.log(':: :: ', res);

        this.createdDate = this.formatDate(res.createdDate) ?? "";
        this.modifiedDate = this.formatDate(res.lastModifiedDate) ?? "";

        this.selectedPurchaseOrder = res;
        this.projectFormData = res;
        // this.projectFormData.originLocation.nodeName = `${this.projectFormData.originLocation.nodeType} - ${this.projectFormData.originLocation.nodeName}`;
        // this.projectFormData.destinationLocation.nodeName = `${this.projectFormData.destinationLocation.nodeType} - ${this.projectFormData.destinationLocation.nodeName}`;

        let expectedArrivalDate = this.projectFormData?.dueDate?.split("T");
        let expectedDeliveryDate = this.projectFormData?.issueDate?.split("T");
        this.projectFormData.dueDate = expectedArrivalDate
          ? expectedArrivalDate[0]
          : "";
        this.projectFormData.issueDate = expectedDeliveryDate
          ? expectedDeliveryDate[0]
          : "";

        // this.toTypeLabel =
        //   this.projectFormData?.originLocation?.nodeType +
        //   " To " +
        //   this.projectFormData?.destinationLocation?.nodeType;
        this.detailsInputs = this.projectFormData?.details?.map((d: any) => {
          // console.log(':: :: ', d);
          return {
            ...d,
            variantId: d?.variantId,
            skuNo: d?.skuNo,
            plannedQuantity: d?.poQuantity,
            productPrice: d?.poQuantity ? d?.productPrice : 0,
            totalPrice: d?.poQuantity * d?.productPrice,
            productPriceFront: d?.productPrice,
            lockedQuantity: d?.lockedQuantity,
            shippedQuantity: d?.shippedQuantity,
            receivedQuantity: d?.receivedQuantity,
            skuDescription: d?.skuDescription,
            // receivedQuantity: d?.receivedQuantity,
            // sentQuantity: d?.sentQuantity,
            // discrepancyResolvedTo: d?.discrepancyResolvedTo,
            lineNumber: d?.lineNumber,
            shipments: d?.shipments,
            // discrepancyFlag: d?.discrepancyFlag,
            // alreadyAdded: true,
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
        // delete e["productPrice"];
        e["lineNumber"] = parseInt(key + 1);
        // e["sentQuantity"] = parseInt(e["sentQuantity"]);
        e["poQuantity"] = parseInt(e["plannedQuantity"]);
        // e["receivedQuantity"] = parseInt(e["receivedQuantity"]);
      });
      this.projectFormData.details = this.detailsInputs;

      let searchString = "T00:00:00Z"; // The string to search for
      // Check if the searchString exists in the date strings
      // if (!this.projectFormData?.dueDate?.includes(searchString)) {
      //   this.projectFormData.dueDate =
      //     this.projectFormData.dueDate + "T00:00:00Z";
      // }
      if (!this.projectFormData?.issueDate?.includes(searchString)) {
        this.projectFormData.issueDate =
          (this.projectFormData.issueDate
            ? this.projectFormData.issueDate
            : "2023-10-20") + "T00:00:00Z";
      }
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

        // console.log(':: :: ', this.projectFormData);

        // return

        this.purchaseOrderService
          .add({
            ...this.projectFormData,
            dueDate: this.projectFormData.dueDate + "T00:00:00Z",
            // shipToAddress: this.projectFormData?.shipToAddress?.map((s: any) => s.market)?.toString() || '',
            shipToLocation: {
              connectionLocationId:
                this.projectFormData.shipToLocation.connectionLocationId,
            },
            vendor: {
              id: this.projectFormData.vendor.id,
            },
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
        // const today = new Date();
        // const expectedArrivalDate = new Date(
        //   this.projectFormData.dueDate
        // );
        // const expectedDeliveryDate = new Date(
        //   this.projectFormData.issueDate
        // );

        // // Set the time components to 00:00:00
        // today.setHours(0, 0, 0, 0);
        // expectedArrivalDate.setHours(0, 0, 0, 0);
        // expectedDeliveryDate.setHours(0, 0, 0, 0);

        // const secondsToday = Math.floor(today.getTime() / 1000);
        // const secondsExpectedArrival = Math.floor(
        //   expectedArrivalDate.getTime() / 1000
        // );
        // const secondsExpectedDelivery = Math.floor(
        //   expectedDeliveryDate.getTime() / 1000
        // );

        // if (secondsExpectedDelivery < secondsToday) {
        //   this._showDateToast(
        //     "Expected delivery date should be greater than or equal to today"
        //   );
        //   return;
        // }
        // if (secondsExpectedArrival < secondsExpectedDelivery) {
        //   this._showDateToast(
        //     "Expected arrival date should be greater than or equal to expected delivery date"
        //   );
        //   return;
        // }
        this.purchaseOrderService
          .updatePurchaseOrder(this.paramId, {
            ...this.projectFormData,
            dueDate: this.projectFormData.dueDate + "T00:00:00Z",
            // shipToAddress: this.projectFormData?.shipToAddress?.map((s: any) => s.market)?.toString() || '',
          })
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
        this.router.navigate(["/business/purchase-order"]);
      } else {
        this.getPurchaseOrderById(this.paramId);
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
            // this.detailsInputs = [];
            this.stVariants?.forEach((p: any) => {
              // console.log("p?.selected === true",p?.selected === true);
              // console.log("this.addedVariantIds.includes(p?.variantId)",this.addedVariantIds);
              // console.log("this.detailsInputs",this.detailsInputs);

              if (
                p?.selected === true &&
                !this.addedVariantIds.includes(p?.variantId) &&
                !this.detailsInputs.some(
                  (input: any) => input.variantId === p?.variantId
                )
              ) {
                console.log("------p--------->", p);

                // Push the object only if the variantId is not in the addedVariantIds array
                // and it's not already in detailsInputs

                this.detailsInputs.push({
                  lineNumber: this.detailsInputs?.length + 1,
                  variantId: p?.variantId,
                  color: p?.color,
                  skuNo: p?.sku,
                  skuDescription: p?.desc
                    ? p?.desc
                    : "" + " " + p?.size + " " + p?.color,
                  plannedQuantity: null,
                  productPrice: null,
                  size: p?.size,
                  exwSgdCost: p.exwSgdCost,
                  style: p?.style,
                  fabicSwatch: p?.fabicSwatch,
                  fabricComposition: p?.fabricComposition
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

  shipmentDialog(shipments: any) {
    console.log(":: shipments :: ", shipments);
    const results = this.dialogService.open({
      ...this.shipmentConfig,
      // dialogtype: dialogtype,
      // showAnimation: showAnimation,
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
        shipments: shipments,
        vList: (vData: any) => {},
      },
    });
  }

  editQty(sDetails: any, index: number) {
    const results = this.dialogService.open({
      ...this.editQtyConfig,
      // dialogtype: dialogtype,
      // showAnimation: showAnimation,
      buttons: [
        {
          cssClass: "primary",
          text: "Update",
          disabled: false,
          handler: (variantList: any) => {
            document.getElementById("createNdUpdateBtn")?.click();
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
        sDetails: {
          ...sDetails,
          index: index
        },
        vList: (vData: any) => {
          this.detailsInputs[vData?.index].plannedQuantity = vData?.plannedQuantity; 
        },
      },
    });
  }

  splitAllocation(sDetails: any, index: number) {
    const results = this.dialogService.open({
      ...this.splitAllocationConfig,
      buttons: [
        {
          cssClass: "primary",
          text: "Update",
          disabled: false,
          handler: (variantList: any) => {
            let stObj:any[] = [];
            let obj:any = {};
            let checkIfAllFilled = this.storeSplitDetails?.filter((split: any) => (!split.market || !split.qty));
            this.storeSplitDetails?.forEach((splitInfo:any) => {
              let key = splitInfo.market.id;
              obj[key] = splitInfo.qty;
              // stObj.push(obj);
            });

            this.purchaseOrderService.splitManagement(this.paramId, obj).subscribe((res: any) => {
              console.log(':: :: ', res);
              checkIfAllFilled?.length === 0 ? results.modalInstance.hide():null;
            })
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
        shippingAddressList: this.shippingAddressList,
        vList: (vData: any) => {
          this.storeSplitDetails = vData;
        },
      },
    });
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

    if (keyName === "plannedQuantity") {
      console.log("details", this.detailsInputs);
      console.log(
        "this.detailsInputs[index][keyName]",
        this.detailsInputs[index][keyName]
      );
      console.log(
        "this.detailsInputs[index]['productPriceFront']",
        this.detailsInputs[index]["productPriceFront"]
      );

      this.detailsInputs[index]["productPrice"] =
        this.detailsInputs[index][keyName] *
        this.detailsInputs[index]["productPriceFront"];
      console.log(
        "this.detailsInputs[index]['productPrice']",
        this.detailsInputs[index]["productPrice"]
      );
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
    // if (!this.projectFormData.dueDate.includes(searchString)) {
    //   this.projectFormData.dueDate =
    //     this.projectFormData.dueDate + "T00:00:00Z";
    // }
    // if (!this.projectFormData.issueDate.includes(searchString)) {
    //   this.projectFormData.issueDate =
    //   (this.projectFormData.issueDate ? this.projectFormData.issueDate:'2023-10-20') + "T00:00:00Z";
    // }

    this.detailsInputs?.forEach((e: any, key: any) => {
      e["lineNumber"] = parseInt(key + 1);
      e["poQuantity"] = parseInt(e["plannedQuantity"]);
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

    this.purchaseOrderService
      .updateStatus({
        id: this.paramId,
        formData: {
          ...this.projectFormData,
          dueDate: this.projectFormData.dueDate + "T00:00:00Z",
        },
        type: type,
      })
      .subscribe(
        (res) => {
          let type;
          let msg;
          this.getPurchaseOrderById(this.paramId);
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
    this.purchaseOrderService
      .updateStatus({
        id: this.paramId,
        formData: this.dObj,
        type: "resolve-discrepancy",
      })
      .subscribe(
        (res) => {
          let type;
          let msg;
          this.getPurchaseOrderById(this.paramId);
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
    this.addedVariantIds?.splice(rowIndex, 1);
  }

  _validateFormInputs() {
    if (!this.detailsInputs?.length) {
      this._showError("Please add atleast one product!");
      return false;
    } else if (
      this.detailsInputs?.filter((p: any) => !p.plannedQuantity)?.length
    ) {
      this._showError("One or more field is required!");
      return false;
    }
    return true;
  }

  _showError(eMsg: string) {
    this.toastService.open({
      value: [
        {
          severity: "error",
          content: eMsg,
        },
      ],
      life: 2000,
    });
  }

  confirmDialog(type: string) {
    if (!this._validateFormInputs()) return;
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
              creditTermsId: v.creditTermsDto.creditTermsId,
            },
          };
        });
      });
  }

  setAddress(address: string, fValue: string) {
    this.projectFormData[fValue] = address;
    console.log(':: :: ', address, this.projectFormData.shipToAddress);
  }

  _dateVaidationForToday() {
    let dtToday = new Date();

    let month: any = dtToday.getMonth() + 1;
    let day: any = dtToday.getDate();
    let year = dtToday.getFullYear();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    return year + "-" + month + "-" + day;
  }

  _checkTotalPrice() {
    let tPrice: any = 0;
    this.detailsInputs.forEach((v: any) => {
      tPrice =
        tPrice +
        v.plannedQuantity * (v.exwSgdCost ? v.exwSgdCost : v.productPrice);
    });
    return tPrice;
  }

  setContactDetails(user: any) {
    console.log(':: :: ', user);
    this.projectFormData.contactUsername = user?.username || '';
    this.projectFormData.contactEmail = user?.email || '';
    this.projectFormData.contactPhone = user?.username || '';
  }
}
