import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionLocationListComponent } from './connection-location-list.component';

describe('ConnectionLocationListComponent', () => {
  let component: ConnectionLocationListComponent;
  let fixture: ComponentFixture<ConnectionLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionLocationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
