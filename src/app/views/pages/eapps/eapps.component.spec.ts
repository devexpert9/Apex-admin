import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAPPSComponent } from './eapps.component';

describe('EAPPSComponent', () => {
  let component: EAPPSComponent;
  let fixture: ComponentFixture<EAPPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAPPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAPPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
