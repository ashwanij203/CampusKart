import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyCampuskart } from './why-campuskart';

describe('WhyCampuskart', () => {
  let component: WhyCampuskart;
  let fixture: ComponentFixture<WhyCampuskart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyCampuskart],
    }).compileComponents();

    fixture = TestBed.createComponent(WhyCampuskart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
