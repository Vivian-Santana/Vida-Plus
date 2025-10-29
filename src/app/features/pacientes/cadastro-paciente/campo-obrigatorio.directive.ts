import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[campoObrigatorio]'
})
export class CampoObrigatorioDirective implements OnInit {
  @Input() formSubmitted = false;

  private errorElement!: HTMLElement;

  constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {}

  ngOnInit() {
    // Cria o elemento de mensagem (oculto por padrão)
    this.errorElement = this.renderer.createElement('div');
    this.renderer.addClass(this.errorElement, 'text-danger');
    this.renderer.setStyle(this.errorElement, 'font-size', '0.85rem');
    this.renderer.setStyle(this.errorElement, 'margin-top', '2px');
    const text = this.renderer.createText('Campo obrigatório');
    this.renderer.appendChild(this.errorElement, text);
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorElement);
    this.renderer.setStyle(this.errorElement, 'display', 'none');
  }

  ngDoCheck() {
    if (!this.control.control) return;

    const invalid = this.control.invalid && (this.control.touched || this.formSubmitted);
    this.renderer.setStyle(this.errorElement, 'display', invalid ? 'block' : 'none');
  }
}
