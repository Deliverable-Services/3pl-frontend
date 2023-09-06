import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOrderListComponent } from './transfer-order-list.component';

describe('TransferOrderListComponent', () => {
  let component: TransferOrderListComponent;
  let fixture: ComponentFixture<TransferOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
