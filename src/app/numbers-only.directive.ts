import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    console.log('working on input1');
    const inputElement = this.el.nativeElement;
    const initialValue = inputElement.value;
    inputElement.value = initialValue.replace(/[^0-9]/g, ''); // Only allow numeric characters
    if (initialValue !== inputElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent): void {
    console.log('working on input');
    
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (allowedKeys.indexOf(event.key) === -1) {
      event.preventDefault();
    }
  }
}
