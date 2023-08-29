import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionLocationFormComponent } from './connection-location-form.component';

describe('ConnectionLocationFormComponent', () => {
  let component: ConnectionLocationFormComponent;
  let fixture: ComponentFixture<ConnectionLocationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionLocationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionLocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
