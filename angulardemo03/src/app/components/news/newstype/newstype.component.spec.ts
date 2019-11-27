import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstypeComponent } from './newstype.component';

describe('NewstypeComponent', () => {
  let component: NewstypeComponent;
  let fixture: ComponentFixture<NewstypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewstypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
