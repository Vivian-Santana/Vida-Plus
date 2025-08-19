import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaConsultaComponent } from './nova-consulta.component';

describe('NovaConsultaComponent', () => {
  let component: NovaConsultaComponent;
  let fixture: ComponentFixture<NovaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
