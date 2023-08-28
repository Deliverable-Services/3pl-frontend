import { Injectable } from "@angular/core";
import { Observable, of as observableOf, throwError } from "rxjs";

import { environment } from "src/environments/environment";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { ProductsListData } from "../data/styleList";
import { Products } from "../data/productList";
import { PageParam, SearchParam } from "../data/searchFormData";
import { catchError } from "rxjs/operators";

@Injectable()
export class ProductsListDataService extends ProductsListData {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
    super();
  }

  private dataUrl = 'assets/countries.json';

  private searchParams = {
    filters: [
      {
        field: "styleName",
        operator: "match",
        value: "",
      },
      {
        field: "status",
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
        // if(searchParams.keyword != "")        
          return {
            field: searchParams.columnName,
            operator: searchParams.searchType,
            value: searchParams.keyword,
          };
      } else {
        // if(searchParams.keyword != "")
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
      `${this.baseApiUrl}/product/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getListActive(): Observable<any> {
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

  add(data: Products) {
    return this.http.post(`${this.baseApiUrl}/product`, data);
  }

  update(id: string, data: Products): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/product/${id}`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        // if (error.status === 500) {
        console.error("Server error occurred:", error);
        // do something with the error here, for example send it to your error tracking system
        // }
        return throwError(error);
      })
    );
  }

  setPublish(id: string, data: Products): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/product/${id}/publish`, data);
  }

  setActive(id: string): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/product/${id}/active`, []);
  }

  setInactive(id: string): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/product/${id}/inactive`, []);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/product/${id}`);
  }
  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/style/${data.styleId}/${data.active}`,
      ""
    );
  }
  getCountriesData() {
    return this.http.get<any[]>(this.dataUrl);
  }

  uploadProductImage(id: string, data: FormData){
    return this.http.post(
      `${this.baseApiUrl}/product/${id}/image-upload`,
      data
    );
  }

}
