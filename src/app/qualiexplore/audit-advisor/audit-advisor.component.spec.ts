import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAdvisorComponent } from './audit-advisor.component';

describe('AuditAdvisorComponent', () => {
  let component: AuditAdvisorComponent;
  let fixture: ComponentFixture<AuditAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
