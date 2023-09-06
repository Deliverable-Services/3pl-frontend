import { Observable } from "rxjs";
import { Brand } from "./brandList";

export interface TransferOrder {
  categoryId?: string;
  categoryName?: string;
  updatedAt?: any;
  createdAt?: any;
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

export abstract class TransferOrderListData {
  // abstract getListData(pager: ListPager): Observable<Brand[]>;
  // abstract getOriginSource(pager: ListPager): Observable<Brand[]>;
  // abstract getTreeSource(pager: ListPager): Observable<Brand[]>;
  // abstract getCardSource(pager: ListPager): Observable<Brand[]>;
}
