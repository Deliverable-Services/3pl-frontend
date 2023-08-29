import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";

import { Season } from "../data/season";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ListPager, Product, ProductListData } from "../data/productList";
import { Brand, Card } from "../data/brandList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class ProductListDataService {
  baseApiUrl: string = environment.baseUrl;
  private dataUrl = 'assets/countries.json';
  constructor(private http: HttpClient) {}

  private searchParams = {
    filters: [
      {
        field: "productSku",
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
    console.log(this.pageParams);
  }

  getProductById(id: string) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`/product/${id}`, httpOptionsToken);
  }

  getProductList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({}),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/products`,
      this.searchParams,
      httpOptionsToken
    );
  }

  addProduct(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    // console.log("data=============", data);
    return this.http.post(`${this.baseApiUrl}/product`, data);
  }

  getCountriesData() {
    return this.http.get<any[]>(this.dataUrl);
  }


  updateProduct(data: any, id: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    // console.log("data=============", data);
    return this.http.put(`${this.baseApiUrl}/product/${id}`, data);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/product/${data.productId}/${data.active}`,
      ""
    );
  }
}
