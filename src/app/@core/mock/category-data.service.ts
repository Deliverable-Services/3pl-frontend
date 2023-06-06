import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Card, ListPager, CategoryListData } from "../data/categoryList";
import { Season } from "../data/season";
import { Category } from "../data/categoryList";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class CategoryListDataService extends CategoryListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl;
  }

  private searchParams = {
    filters: [
      {
        field: "categoryName",
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

  addCategory(data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/category`,
      data,
      httpOptionsToken
    );
  }

  getCategoryList(): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/categories`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getCategoryListActive() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
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
      `${this.baseApiUrl}/categories`,
      searchParams,
      httpOptionsToken
    );
  }

  updateCategory(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/category/${id}`,
      data,
      httpOptionsToken
    );
  }

  getCategoryById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/category/${id}`, httpOptionsToken);
  }

  addSubCategory(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/category/${id}/subcategory`,
      data,
      httpOptionsToken
    );
  }

  editSubCategory(
    categoryId: string,
    data: any,
    subCategoryId: string
  ): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `/category/${categoryId}/subcategory/${subCategoryId}`,
      data,
      httpOptionsToken
    );
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/category/${data.categoryId}/${data.active}`,
      ""
    );
  }

  statusToggleSubCat(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/category/${data.categoryId}/subcategory/${data.subcategoryId}/${data.active}`,
      ""
    );
  }
}
