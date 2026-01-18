import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css'
})
export class AlertModalComponent {
  constructor(public modalService: ModalService,) {}
}
