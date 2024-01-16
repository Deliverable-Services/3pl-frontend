import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class UserManagementService {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  private searchParams = {
    filters: [
      {
        field: "userId",
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

  getList(srarchParams?: any, pageParams?: any): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: pageParams ? pageParams:this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/users/list`,
      srarchParams ? srarchParams:this.searchParams,
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

  addUser(data: any) {
    return this.http.post(`${this.baseApiUrl}/credit-terms`, data);
  }

  updateUser(id: string, data: any): Observable<any> {
    let fData = data;
    return this.http.put( 
      `${this.baseApiUrl}/users/${id}`,
      fData
    );
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/users/${id}`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/role/list`);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/credit-terms/${data.id}/${data.active}`,
      ""
    );
  }
}
