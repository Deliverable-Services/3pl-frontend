import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class ConnectionLocationService {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  private searchParams = {
    filters: [
      {
        field: "connectionLocationSubject",
        operator: "match",
        value: "",
      },
      // {
      //   field: "styleCode",
      //   operator: "match",
      //   value: "",
      // },
    ],
  };

  private pageParams = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  setSearchParams(searchParams: SearchParam) {
    this.searchParams.filters = this.searchParams.filters.map((param: any) => {
      if (param.field === searchParams.columnName) {
        return {
          field: searchParams.columnName,
          operator: searchParams.searchType,
          value: searchParams.keyword,
        };
      } else {
        return param;
      }
    });
  }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
  }

  getList(): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/connection-location/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getStyleListActive(): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        // fromObject: this.pageParams,
      }),
    };

    const searchParams = {
      filters: [
        {
          field: "isActive",
          operator: "equal",
          value: true,
        },
      ],
    };

    return this.http.post(
      `${this.baseApiUrl}/styles`,
      searchParams,
      httpOptionsToken
    );
  }

  add(data: any) {
    return this.http.post(`${this.baseApiUrl}/connection-location`, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseApiUrl}/connection-location/${id}`,
      data
    );
  }

  getConnectionLocationById(id: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/connection-location/${id}`);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/credit-terms/${data.id}/${data.active}`,
      ""
    );
  }
}
