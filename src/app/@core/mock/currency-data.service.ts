import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Company, CompanyListData, Card, ListPager } from "../data/companyList";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CurrencyRate, CurrencyListData } from "../data/CurrencyList";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable({
  providedIn: "root",
})
export class CurrencyDataService extends CurrencyListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl4;
  }

  private searchParams = {
    filters: [
      {
        field: "currencyCode",
        operator: "match",
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

  private CurrencyListData: CurrencyRate[] = [];

  getCurrencyList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/currency/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getCurrencyListActive(data?: any) {

    const searchParams = {
      filters: [
        {
          field: "",
          operator: "",
          value: "",
        },
      ],
    };

    let catUri;
    if(data) {
      catUri = `${this.baseApiUrl}/currency/list?pageSize=${data.perPage}`;
    } else {
      catUri = `${this.baseApiUrl}/currency/list`;
    }

    return this.http.post(
      catUri,
      searchParams
    );
  }

  addCurrency(data: CurrencyRate) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };
    // console.log("data=============", data);
    return this.http.post(`${this.baseApiUrl}/currency`, data);
  }

  updateCurrency(id: string, data: CurrencyRate): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(`${this.baseApiUrl}/currency/${id}`, data, httpOptionsToken);
  }

  getCurrencyById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/currency/${id}`, httpOptionsToken);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/currency/${data.id}/${data.active}`,
      ""
    );
  }
}
