import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { DialogService, FormLayout, TableWidthConfig } from "ng-devui";
import { Subscription } from "rxjs";
import { Company } from "src/app/@core/data/companyList";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";

import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.scss"],
})
  
export class CompanyListComponent implements OnInit, OnChanges {
  filterAreaShow = false;
  isAdd: string = "ADD";
  vendorParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  sortOptions = ["asc", "desc"];

  searchForm: {
    keyword: "";
    sort: "asc" | "desc";
  } = {
      keyword: "",
      sort: "asc",
    };

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: "id",
      width: "150px",
    },
    {
      field: "companyName",
      width: "150px",
    },
    {
      field: "address",
      width: "150px",
    },
    {
      field: "updatedDate",
      width: "100px",
    },
    {
      field: "Actions",
      width: "100px",
    },
  ];

  basicDataSource: Company[] = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription | undefined;

  constructor(
    private companyDataService: CompanyDataService,
    private dialogService: DialogService,
    private router: Router
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit() {
    this.getCompanyList();
  }

  getCompanyList() {
    this.busy = this.companyDataService
      .getCompanyList(undefined, undefined)
      .subscribe((res: any) => {
        console.log(res);
        this.basicDataSource = [res];
      });
  }

  editCompany(rowId: any, index: number) {
    this.isAdd = "EDIT";
    this.editRowIndex = index;
    this.router.navigate([`/business/company/edit/${rowId}`]);
  }

  deleteCompany(index: number) {
    const results = this.dialogService.open({
      id: "delete-dialog",
      width: "346px",
      maxHeight: "600px",
      title: "Delete",
      showAnimate: false,
      content: "Are you sure you want to delete it?",
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: ($event: Event) => {
            this.basicDataSource.splice(index, 1);
            results.modalInstance.hide();
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

  onSubmitted(e: any) {
    console.log("Submitted", e);
    this.editForm!.modalInstance.hide();
    if (this.isAdd === "EDIT") {
      this.basicDataSource.splice(this.editRowIndex, 1, e);
    } else {
      this.basicDataSource.unshift({
        id: `${(Math.random() * 34654564536453).toFixed(0)}`,
        ...e,
      });
    }
  }
}
