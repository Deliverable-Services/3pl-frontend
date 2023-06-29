import { Observable } from "rxjs";

export interface SearchParam {
  keyword: string;
  sort: string;
  columnName: string;
  searchType: string;
}

export interface PageParam {
  pageNo: string;
  pageSize: string;
  sortBy: string;
  sortDir: string;
}
