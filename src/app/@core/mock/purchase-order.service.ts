import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";

// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable()
export class PurchaseOrderService {
  
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

  add(data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/purchase-order`,
      data,
      httpOptionsToken
    );
  }

  getTransferOrderList(searchParams:any): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/purchase-order/list`,
      searchParams ? searchParams :this.searchParams,
      httpOptionsToken
    );
  }

  getTransferOrderListActive(data?: any) {

    // const searchParams = {
    //   filters: [
    //     {
    //       field: "isActive",
    //       operator: "equal",
    //       value: true,
    //     },
    //   ],
    // };

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

  updateTransferOrder(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/purchase-order/${id}`,
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

    return this.http.get(`${this.baseApiUrl}/purchase-order/${id}`, httpOptionsToken);
  }

  updateStatus(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/purchase-order/${data?.id}/${data?.type}`,
      data?.formData,
      httpOptionsToken
    );
  }

  resolveDiscrepancy(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/purchase-order/${data?.id}/resolve-discrepancy`,
      data?.formData,
      httpOptionsToken
    );
  }

  deleteTransferOrder(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/purchase-order/${id}/delete`,
      {},
      httpOptionsToken
    );
  }
}
