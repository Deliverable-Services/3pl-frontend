import { Observable } from "rxjs";

export interface POHeader {
  poReference?: string;
  vendor?: any;
  vendorContact?: any;
  company?: any;
  shipToDepartment?: any;
  billToAddress: string;
  shipToAddress: string;
  createdAt?: any;
  tradeTerm?: any;
  poDetails?: any;
  remarks?: string;
}

export interface ListPager {
  pageSize?: number;
  pageIndex?: number;
}

export interface CardAction {
  icon?: string;
  num?: string;
}

export interface Card {
  name?: string;
  id?: number;
  ame?: string;
  title?: string;
  imgSrc?: string;
  subTitle?: string;
  content?: string;
  agreeNum?: number;
  starsNum?: number;
  messageNum?: number;
  actions?: CardAction[];
}

export abstract class POHeaderListData {
  // abstract getListData(pager: ListPager): Observable<Brand[]>;
  // abstract getOriginSource(pager: ListPager): Observable<Brand[]>;
  // abstract getTreeSource(pager: ListPager): Observable<Brand[]>;
  // abstract getCardSource(pager: ListPager): Observable<Brand[]>;
}
