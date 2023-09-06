import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPartnerFormComponent } from './shipping-partner-form.component';

describe('ShippingPartnerFormComponent', () => {
  let component: ShippingPartnerFormComponent;
  let fixture: ComponentFixture<ShippingPartnerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingPartnerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPartnerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
