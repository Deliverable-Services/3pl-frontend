import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTermsListComponent } from './credit-terms-list.component';

describe('CreditTermsListComponent', () => {
  let component: CreditTermsListComponent;
  let fixture: ComponentFixture<CreditTermsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditTermsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTermsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
