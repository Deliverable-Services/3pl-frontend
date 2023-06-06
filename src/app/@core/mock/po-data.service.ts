import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  POHeaderListData,
  Card,
  ListPager,
  POHeader,
} from "../data/poHeaderList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl2;

@Injectable()
export class PoDataService extends POHeaderListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl2;
  }

  private searchParams = {
    filters: [
      {
        field: "",
        operator: "",
        value: "",
      },
    ],
  };

  private pageParams = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  setSearchParams(searchParams: SearchParam) {
    this.searchParams = {
      filters: [
        {
          field: searchParams.columnName,
          operator: searchParams.searchType,
          value: searchParams.keyword,
        },
      ],
    };
  }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
    console.log(this.pageParams);
  }

  private poListData: POHeader[] = [];

  getPOList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/po-list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  addPO(data: POHeader) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.baseApiUrl}/po`, data);
  }

  updatePO(id: string, data: POHeader): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.put(
      `${this.baseApiUrl}/po/${id}/save`,
      data,
      httpOptionsToken
    );
  }

  getPOById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/po/${id}`, httpOptionsToken);
  }

  changePOToSubmit(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/submit`,
      data,
      httpOptionsToken
    );
  }

  changePOToReady(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/sample/ready`,
      httpOptionsToken
    );
  }

  changePOToConfirm(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/sample/confirm`,
      httpOptionsToken
    );
  }

  changePOToReject(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/sample/reject`,
      httpOptionsToken
    );
  }

  releasePO(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/release`,
      httpOptionsToken
    );
  }

  closePO(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/close`,
      httpOptionsToken
    );
  }

  cancelPO(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/po/${id}/cancel`,
      httpOptionsToken
    );
  }
}
