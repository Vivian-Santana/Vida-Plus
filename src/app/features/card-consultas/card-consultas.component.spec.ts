import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardConsultasComponent } from './card-consultas.component';

describe('CardConsultasComponent', () => {
  let component: CardConsultasComponent;
  let fixture: ComponentFixture<CardConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
