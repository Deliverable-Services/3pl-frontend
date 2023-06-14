import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand, BrandListData, Card, ListPager } from "../data/brandList";
import { Season } from "../data/season";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { StyleListData } from "../data/styleList";
// import { Category } from "../data/categoryList";
import { Products } from "../data/productList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class CreditTermsService {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  private searchParams = {
    filters: [
      {
        field: "creditTermsSubject",
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
      `${this.baseApiUrl}/credit-terms/list`,
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

  addCreditTerms(data: any) {
    return this.http.post(`${this.baseApiUrl}/credit-terms`, data);
  }

  updateCreditTerms(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseApiUrl}/credit-terms/${id}`,
      data
    );
  }

  getCreditTermsById(id: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/credit-terms/${id}`);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/credit-terms/${data.id}/${data.active}`,
      ""
    );
  }
}
