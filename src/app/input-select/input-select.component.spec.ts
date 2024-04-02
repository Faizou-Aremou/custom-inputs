import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxInputSelectComponent } from './input-select.component';

describe('InputSelectComponent', () => {
  let component: TxInputSelectComponent;
  let fixture: ComponentFixture<TxInputSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TxInputSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TxInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
