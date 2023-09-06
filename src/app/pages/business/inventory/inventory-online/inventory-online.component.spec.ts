import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOnlineComponent } from './inventory-online.component';

describe('InventoryOnlineComponent', () => {
  let component: InventoryOnlineComponent;
  let fixture: ComponentFixture<InventoryOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
