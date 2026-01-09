import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAtualizarComponent } from './card-atualizar.component';

describe('CardAtualizarComponent', () => {
  let component: CardAtualizarComponent;
  let fixture: ComponentFixture<CardAtualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAtualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAtualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
