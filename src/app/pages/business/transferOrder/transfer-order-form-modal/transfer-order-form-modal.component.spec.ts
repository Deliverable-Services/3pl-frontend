import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOrderFormModalComponent } from './transfer-order-form-modal.component';

describe('TransferOrderFormModalComponent', () => {
  let component: TransferOrderFormModalComponent;
  let fixture: ComponentFixture<TransferOrderFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferOrderFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOrderFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
