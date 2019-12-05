import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkInProgressComponent } from './work-in-progress.component';
import { AppComponent } from '../app/app.component';

describe('WorkInProgressComponent', () => {
  let component: WorkInProgressComponent;
  let fixture: ComponentFixture<WorkInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkInProgressComponent, AppComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test.skip('should create', () => {
    expect(component).toBeTruthy();
  });
});
