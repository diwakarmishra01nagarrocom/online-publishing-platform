import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriterDashboard } from './writer-dashboard';

describe('WriterDashboard', () => {
  let component: WriterDashboard;
  let fixture: ComponentFixture<WriterDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriterDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(WriterDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
