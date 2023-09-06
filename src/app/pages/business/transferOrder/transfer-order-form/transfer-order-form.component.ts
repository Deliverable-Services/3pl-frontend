import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormLayout, ToastService } from "ng-devui";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { TransferOrderListDataService } from "src/app/@core/mock/tranfer-order.service";
import { MSG } from "src/config/global-var";

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
      nodeName: ""
    },
    originLocation: {
      connectionLocationId: "",
      nodeName: ""
    },
    details: [],
  };
  paramId: string = "";
  connectionLocationList: any[] = [];
  selectedTransferOrder: any = {};
  constructor(
    private transferOrderService: TransferOrderListDataService,
    private connectionLocationService: ConnectionLocationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getTransferOrderById(this.paramId);
    }

    this.getConnectionLocationList();
    console.log('getConnectionLocationList',this.connectionLocationList);
    
  }

  getConnectionLocationList() {
    this.connectionLocationService
      .getList()
      .subscribe((res) => {
        this.connectionLocationList.push({
          connectionLocationId: "",
          nodeName:  "ALL",
        })
        res.forEach((item:any) => {
          console.log('item', item);
          this.connectionLocationList.push({
            connectionLocationId: item?.connectionLocationId || "",
            nodeName: item?.nodeName || "",
          });
        });
      });
  }

  validateSelection() {
    const destinationId = this.projectFormData.destinationLocation.connectionLocationId;
    const originId = this.projectFormData.originLocation.connectionLocationId;
    console.log('destinationId', destinationId);
    console.log('originId', originId);
    
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
      console.log({ res });
      this.selectedTransferOrder = res;
      this.projectFormData = res;
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
}
