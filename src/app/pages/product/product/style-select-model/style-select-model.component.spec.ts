import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleSelectModelComponent } from './style-select-model.component';

describe('StyleSelectModelComponent', () => {
  let component: StyleSelectModelComponent;
  let fixture: ComponentFixture<StyleSelectModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyleSelectModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleSelectModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
