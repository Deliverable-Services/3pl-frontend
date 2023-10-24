import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentAndShippingListComponent } from './shipment-and-shipping-list.component';

describe('ShipmentAndShippingListComponent', () => {
  let component: ShipmentAndShippingListComponent;
  let fixture: ComponentFixture<ShipmentAndShippingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentAndShippingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentAndShippingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
