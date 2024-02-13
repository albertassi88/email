import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: `[ngModel][letras]`,
  providers: [NgModel]
})
export class LetrasDirective {

  constructor(private el: ElementRef, private ngModel: NgModel) { }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if ((e.keyCode > 47 && e.keyCode < 65) ||
      (e.keyCode > 90 && e.keyCode < 165) ||
      (e.keyCode > 165 && e.keyCode < 244)
    ) {
      return false;
    }
    return true;
  }

  @HostListener('paste', ['$event']) blockPaste(e: any) {
    let clipboardData = e['clipboardData'];
    let pastedText: string = clipboardData.getData('text');
    if (pastedText) {
      let soLetras = /[^a-zA-ZÀ-ú ]/gi; //só letras
      let soEspaco = /\s{2,}/g; //remove espaços duplicados
      pastedText = pastedText.replace(soLetras, '');
      pastedText = pastedText.replace(soEspaco, ' ' );
      pastedText = pastedText.trim();
      this.ngModel.update.emit(pastedText)
    }
    e.preventDefault();
  }

}
