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
import {
  DialogService,
  FormLayout,
  SortEventArg,
  TableWidthConfig,
} from "ng-devui";
import { Subscription } from "rxjs";
import { Department } from "src/app/@core/data/departmentList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { DepartmentDataService } from "src/app/@core/mock/department-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"],
})
export class DepartmentListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  searchWithDepartmentName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "departmentName",
    searchType: "match",
  };

  searchWithContactPerson: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "contactPerson",
    searchType: "match",
  };

  searchWithContactNumber: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "contactNo",
    searchType: "match",
  };

  searchWithContactEmail: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "contactEmail",
    searchType: "match",
  };

  @Output() checked = new EventEmitter();

  basicDataSource: Department[] = [];

  formData = {};
  editForm: any = null;
  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    departmentName: "",
    contactPerson: "",
    contactNo: "",
    contactEmail: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;

  constructor(
    private departmentDataService: DepartmentDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.departmentDataService.resetParams();0
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.busy = this.departmentDataService
      .getDepartmentList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key: string) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  editDepartment(rowId: any, index: number) {
    this.router.navigate([`/business/department/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.departmentDataService.setSearchParams(searchParam);
    this.getDepartmentList();
  }

  setPageParams(pageParam: PageParam) {
    this.departmentDataService.setPageParams(pageParam);
    this.getDepartmentList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getDepartmentList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getDepartmentList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getDepartmentList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.departmentDataService.setPageParams(this.pageParam);
      this.getDepartmentList();
    }
  }
}
