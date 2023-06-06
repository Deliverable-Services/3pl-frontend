import { Observable } from "rxjs";

export interface Material {
  materialId?: string;
  materialName?: string;
  hsCode?: string;
  origin?: string;

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

export abstract class MaterialListData {
  //   abstract getListData(pager: ListPager): Observable<Material[]>;
  //   abstract getOriginSource(pager: ListPager): Observable<Material[]>;
  //   abstract getTreeSource(pager: ListPager): Observable<Material[]>;
  //   abstract getCardSource(pager: ListPager): Observable<Material[]>;
}
