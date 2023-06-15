import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { MSG } from 'src/config/global-var';
import { ActivatedRoute, Router } from "@angular/router";
import { ConnectionLocationService } from 'src/app/@core/mock/connection-location.service';

@Component({
  selector: 'app-connection-location-form',
  templateUrl: './connection-location-form.component.html',
  styleUrls: ['./connection-location-form.component.scss']
})
export class ConnectionLocationFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData = {
    nodeId: "",
    nodeName: "",
    nodeDesc: "",
    nodeType: "",
    lgStoreOwnerId: "",
    shopifyLocationId: "",
    physicalAddress: "",
    remarks: ""
  };
  nodeList: any[] = ['DC', 'Online', 'Store'];
  paramId: string = "";
  selectedCreditTerms: any = {};
  constructor(
    private connectionLocationService: ConnectionLocationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getCreditTermsById(this.paramId);
    }
  }

  getCreditTermsById(id: string) {
    this.connectionLocationService.getCreditTermsById(id).subscribe((res) => {
      console.log({ res });
      this.selectedCreditTerms = res;
      this.projectFormData = res;
    });
  }

  submitProjectForm(event: any) {
    console.log(event);
    if (event?.valid) {
      if (this.mode === "Add") {
        this.connectionLocationService.add(this.projectFormData).subscribe((res) => this._showToast(res));
      } else {
        this.connectionLocationService
          .update(this.paramId, this.projectFormData)
          .subscribe((res) => this._showToast(res));
      }
    }
  }

  _showToast(resp: any) {
    let type, msg;
    if(resp) {
      type = 'success';
      msg = this.mode === 'Add' ? MSG.create:MSG.update;
      this.router.navigate(["/connection-location"]);
    } else {
      type = 'error';
      msg = MSG.error;
    }
    this.toastService.open({
      value: [
        { severity: type, content: msg},
      ],
      life: 2000,
    });
  }

}
