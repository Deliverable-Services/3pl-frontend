import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";

// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable()
export class InvoiceManagementService {
  
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  private searchParams = {
    filters: [
      
    ],
  };

  private pageParams = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

//   setSearchParams(searchParams: SearchParam) {
//     this.searchParams.filters = this.searchParams.filters.map((param: any) => {
//       if (param.field === searchParams.columnName) {
//         return {
//           field: searchParams.columnName,
//           operator: searchParams.searchType,
//           value: searchParams.keyword,
//         };
//       } else {
//         return param;
//       }
//     });
//   }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
    console.log(this.pageParams);
  }

  getList(searchParams?:any): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/invoice/list`,
      searchParams ? searchParams :this.searchParams,
      httpOptionsToken
    );
  }

  getPurchaseOrderListActive(data?: any) {

    const searchParams = {
      filters: [

      ]
    }

    let catUri;
    if(data) {
      catUri = `${this.baseApiUrl}/purchase-order/list?pageSize=${data.perPage}`;
    } else {
      catUri = `${this.baseApiUrl}/purchase-order/list`;
    }

    return this.http.post(
      catUri,
      searchParams
    );
  }

  update(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/invoice/${id}`,
      data,
      httpOptionsToken
    );
  }

  getById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/invoice/${id}`, httpOptionsToken);
  }

  updateStatus(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/invoice/${data?.id}/${data?.type}`,
      data?.formData,
      httpOptionsToken
    );
  }

  delete(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.delete(
      `${this.baseApiUrl}/invoice/${id}/delete`,
      httpOptionsToken
    );
  }

  create(formInfo: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/invoice`,
      formInfo,
      httpOptionsToken
    );
  }

  generateInvoice(invoiceId: string) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.get(`${this.baseApiUrl}/invoice/${invoiceId}/generate`, httpOptionsToken);
  }
}
