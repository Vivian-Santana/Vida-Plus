import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAgendarConsultaComponent } from './card-agendar-consulta.component';

describe('CardAgendarConsultaComponent', () => {
  let component: CardAgendarConsultaComponent;
  let fixture: ComponentFixture<CardAgendarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAgendarConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAgendarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
