import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPartnerListComponent } from './shipping-partner-list.component';

describe('ShippingPartnerListComponent', () => {
  let component: ShippingPartnerListComponent;
  let fixture: ComponentFixture<ShippingPartnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingPartnerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPartnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
