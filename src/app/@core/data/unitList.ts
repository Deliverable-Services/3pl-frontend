import { Observable } from "rxjs";

export interface Unit {
  unitId?: string;
  unitName?: string;
  updatedAt?: string;
  createdAt?: string;
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

export abstract class UnitListData {
  // abstract getOriginSource(pager: ListPager): Observable<Unit[]>;
  // abstract getTreeSource(pager: ListPager): Observable<Unit[]>;
}
