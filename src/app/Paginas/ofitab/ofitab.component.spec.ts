import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfitabComponent } from './ofitab.component';

describe('OfitabComponent', () => {
  let component: OfitabComponent;
  let fixture: ComponentFixture<OfitabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfitabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfitabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
