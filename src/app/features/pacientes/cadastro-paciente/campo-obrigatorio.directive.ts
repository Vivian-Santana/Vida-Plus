import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[campoObrigatorio]'
})
export class CampoObrigatorioDirective implements OnInit {
  @Input() formSubmitted = false;
  @Input() mensagensErro: { [key: string]: string } = {};

  constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {}

  private errorElements: { [key: string]: HTMLElement } = {};

  ngOnInit() {
    // Sempre inclui 'required' como padrão, mas permite sobrescrever
    const erros = { required: 'Campo obrigatório', ...this.mensagensErro };

    Object.entries(erros).forEach(([tipo, mensagem]) => {
        const div = this.renderer.createElement('div');
        this.renderer.addClass(div, 'text-danger');
        this.renderer.setStyle(div, 'font-size', '0.85rem');
        this.renderer.setStyle(div, 'margin-top', '2px');
        const text = this.renderer.createText(mensagem);
        this.renderer.appendChild(div, text);
        this.renderer.appendChild(this.el.nativeElement.parentNode, div);
        this.renderer.setStyle(div, 'display', 'none');

        // Salva cada elemento por tipo de erro
        if (!this.errorElements) this.errorElements = {};
        this.errorElements[tipo] = div;
    });
  }

  ngDoCheck() {
    if (!this.control.control) return;

    Object.keys(this.errorElements).forEach(tipo => {
        const mostrar = this.control.hasError(tipo) && (this.control.touched || this.formSubmitted);
        this.renderer.setStyle(this.errorElements[tipo], 'display', mostrar ? 'block' : 'none');
    });
    }
}
