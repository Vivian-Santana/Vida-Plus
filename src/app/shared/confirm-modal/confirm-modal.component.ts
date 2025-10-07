import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() titulo: string = 'Confirmação';
  @Input() mensagem: string = 'Tem certeza?';
  @Output() confirmado = new EventEmitter<void>();
  @Output() fechado = new EventEmitter<void>();

  confirmar() {
    this.confirmado.emit();
  }

  fechar() {
    this.fechado.emit();
  }
}
