import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOrderFormComponent } from './transfer-order-form.component';

describe('TransferOrderFormComponent', () => {
  let component: TransferOrderFormComponent;
  let fixture: ComponentFixture<TransferOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
