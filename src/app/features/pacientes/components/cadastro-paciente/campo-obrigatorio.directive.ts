import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[campoObrigatorio]'
})
export class CampoObrigatorioDirective implements OnInit, OnDestroy {
  @Input() formSubmitted = false;
  @Input() mensagensErro: { [key: string]: string } = {};

  private destroy$ = new Subject<void>(); //evita memory leak
  private errorElements: { [key: string]: HTMLElement } = {};

  constructor(
    private el: ElementRef, 
    private control: NgControl, 
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Sempre inclui 'required' como padrão, mas permite sobrescrever
    const erros = { required: 'Campo obrigatório', ...this.mensagensErro };
    const parent = this.el.nativeElement.parentElement;

    Object.entries(erros).forEach(([tipo, mensagem]) => {
        const div = this.renderer.createElement('div');
        this.renderer.addClass(div, 'text-danger');
        this.renderer.setStyle(div, 'font-size', '0.85rem');
        this.renderer.setStyle(div, 'margin-top', '2px');
        this.renderer.setStyle(div, 'display', 'none');

        const text = this.renderer.createText(mensagem);
        this.renderer.appendChild(div, text);
        
        this.renderer.insertBefore(
        parent,
        div,
        this.el.nativeElement.nextSibling
      );
      
        // Salva cada elemento por tipo de erro
        this.errorElements[tipo] = div;
      });

      //Reage a mudanças de status do campo
      this.control.statusChanges
        ?.pipe(takeUntil(this.destroy$)) //subscription cancelada na destruição
        .subscribe(() => this.atualizarErros());


      //Reage ao blur, atualizando erros quando o campo é tocado (touched)
      this.renderer.listen(this.el.nativeElement, 'blur', () => {
        this.atualizarErros();
    });

    this.atualizarErros();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private atualizarErros() {
      if (!this.control.control) return;

      Object.keys(this.errorElements).forEach(tipo => {
          const mostrar = 
          this.control.hasError(tipo) && 
          (this.control.touched || this.formSubmitted);

          this.renderer.setStyle(
            this.errorElements[tipo], 
            'display', 
            mostrar ? 'block' : 'none'
          );
      });
    }

}
