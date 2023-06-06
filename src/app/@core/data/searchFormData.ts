import { Observable } from "rxjs";

export interface SearchParam {
  keyword: string;
  sort: string;
  columnName: string;
  searchType: string;
}

export interface PageParam {
  pageNo: "";
  pageSize: "";
  sortBy: "";
  sortDir: "";
}
