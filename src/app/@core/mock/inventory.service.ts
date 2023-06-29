import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class InventoryService {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  private searchParams = {
    filters: []
  };

  private pageParams = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
  }

  getList(searchVal?: any): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    if(searchVal) {
      this.searchParams.filters = searchVal;
    }

    return this.http.post(
      `${this.baseApiUrl}/inventory/list`,
      this.searchParams,
      httpOptionsToken
    );
  }
}
