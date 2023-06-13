import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTermsFormComponent } from './credit-terms-form.component';

describe('CreditTermsFormComponent', () => {
  let component: CreditTermsFormComponent;
  let fixture: ComponentFixture<CreditTermsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditTermsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTermsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
