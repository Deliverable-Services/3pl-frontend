import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { DepartmentDataService } from 'src/app/@core/mock/department-data.service';
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {

  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any> | undefined;
  departmentFormData = {
    departmentName: "",
    address: "",
    contactNo: "",
    contactPerson: "",
    contactEmail:""
  };
  
  mode: string = "Add";
  paramId: string = "";
  selectedBrand: any = {};

  formData = {};
  editForm: any = null;

  busy: Subscription | undefined;
  selectedDepartment: any;

  constructor(
    private departmentDataService: DepartmentDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getDepartmentById(this.paramId);
    }
  }

  getDepartmentById(id: string) {
    this.departmentDataService.getDepartmentById(id).subscribe((res) => {
      this.selectedDepartment = res;
      this.departmentFormData = {
        departmentName: this.selectedDepartment?.departmentName ?? "",
        address: this.selectedDepartment?.address ?? "",
        contactNo: this.selectedDepartment?.contactNo ?? "",
        contactPerson: this.selectedDepartment?.contactPerson ?? "",
        contactEmail:this.selectedDepartment?.contactEmail ?? ""
      };
    });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;


  getValue(value: object) {
    console.log(value);
  }


  submitDepartmentForm({ valid, directive, data, errors }: any) {
    if (valid) {
      if (this.mode === "Add") {
        this.departmentDataService
          .addDepartment(this.departmentFormData)
          .subscribe((data) => {
            console.log("data", data);
            this.router.navigate(["/business/department"]);
          });
      } else {
        this.departmentDataService
          .updateDepartment(this.paramId, this.departmentFormData)
          .subscribe((data) => {
            this.router.navigate(["/business/department"]);
          });
      }
    } else {
      console.log("errors", errors);
    }
  }
}
