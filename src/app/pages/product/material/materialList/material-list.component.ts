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
import { Brand } from "src/app/@core/data/brandList";
import { Material, MaterialListData } from "src/app/@core/data/material";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { MaterialListDataService } from "src/app/@core/mock/material-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-material-list",
  templateUrl: "./material-list.component.html",
  styleUrls: ["./material-list.component.scss"],
})
export class MaterialListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";
  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  searchWithCategoryName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "materialName",
    searchType: "match",
  };

  searchWithCountry: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "origin",
    searchType: "match",
  };

  basicDataSource: Material[] = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    materialName: "",
    hsCode: "",
    origin: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;

  constructor(
    private materialListDataService: MaterialListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMaterialList();
  }

  getMaterialList() {
    this.busy = this.materialListDataService
      .getMaterialList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key) => {
          let widthValue = res.listSize[key] + "%";
          return (this.columnSize[key] = widthValue);
        });
      });
  }

  setSearchParams(searchParam: SearchParam) {
    this.materialListDataService.setSearchParams(searchParam);
    this.getMaterialList();
  }

  setPageParams(pageParam: PageParam) {
    this.materialListDataService.setPageParams(pageParam);
    this.getMaterialList();
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      materialId: rowId.materialId,
    };
    this.materialListDataService.statusToggle(data).subscribe((res: any) => {});
  }

  editMaterial(rowId: any, index: number) {
    this.router.navigate([`/product/material/edit/${rowId}`]);
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getMaterialList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getMaterialList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getMaterialList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.materialListDataService.setPageParams(this.pageParam);
      this.getMaterialList();
    }
  }
}
