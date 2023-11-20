import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";

// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable()
export class ShippingOrderService {
  
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
      `${this.baseApiUrl}/shipment`,
      data,
      httpOptionsToken
    );
  }

  getList(searchParams:any): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/shipment/list`,
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
      catUri = `${this.baseApiUrl}/shipment/list?pageSize=${data.perPage}`;
    } else {
      catUri = `${this.baseApiUrl}/shipment/list`;
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
      `${this.baseApiUrl}/shipment/${id}`,
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

    return this.http.get(`${this.baseApiUrl}/shipment/${id}`, httpOptionsToken);
  }

  updateStatus(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/shipment/${data?.id}/${data?.type}`,
      data?.formData,
      httpOptionsToken
    );
  }

  addPackage(data: any, sId: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/shipment/${sId}/add-packages`,
      data,
      httpOptionsToken
    );
  }

  updateShippingCost(data: any, sId: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/shipment/${sId}/update-shipping-cost`,
      data,
      httpOptionsToken
    );
  }

  resolveDiscrepancy(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/shipment/${data?.id}/resolve-discrepancy`,
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
      `${this.baseApiUrl}/shipment/${id}/delete`,
      httpOptionsToken
    );
  }

  removePackage(ctnCode: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.delete(
      `${this.baseApiUrl}/shipment/delete-package?ctnCode=${ctnCode}`,
      httpOptionsToken
    );
  }
}
