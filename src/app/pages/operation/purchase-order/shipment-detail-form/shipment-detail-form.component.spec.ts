import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDetailFormComponent } from './shipment-detail-form.component';

describe('ShipmentDetailFormComponent', () => {
  let component: ShipmentDetailFormComponent;
  let fixture: ComponentFixture<ShipmentDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
