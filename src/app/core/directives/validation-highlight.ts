import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';

@Directive({
  selector: '[appValidationHighlight]'
})
export class ValidationHighlight implements AfterViewInit, OnDestroy {

  public errorClass = input<string>('border-red-500 focus:ring-red-500 focus:ring-2'); // Default value
  public normalClass = input<string>('border-gray-300 focus:ring-[#4a3f35] focus:ring-2'); // Default value

  private el = inject(ElementRef<HTMLElement>);
  private control = inject(NgControl);

  private hightLightSubscription?: Subscription;

  constructor() { }

  ngAfterViewInit(): void {
    // Schedule initial validation check in next microtask after view initialization
    Promise.resolve().then(() => {
      this.updateHighlight();
    });

    if (this.el?.nativeElement) {
      // Add event listeners for focus and blur events to update highlight
      this.el.nativeElement.addEventListener('focus', this.onFocus);

      this.el.nativeElement.addEventListener('blur', this.onBlur);
    }


    const control = this.control?.control;
    if (control) {
      this.hightLightSubscription = merge(control.statusChanges, control.valueChanges).subscribe(() => {
        this.updateHighlight();
      });
    }
  }

  private onBlur = (): void => {
    this.updateHighlight();
  }

  private onFocus = (): void => {
    this.updateHighlight();
  }


  private updateHighlight(): void {
    if (!this.control || !this.control.control) return;

    const control = this.control.control;
    const isInvalid = control.invalid && (control.touched || control.dirty);

    this.removeHighlightClass(this.errorClass());
    this.removeHighlightClass(this.normalClass());

    if (isInvalid) {
      this.addHighlightClass(this.errorClass());
    } else {
      this.addHighlightClass(this.normalClass());
    }
  }

  private addHighlightClass(classes: string): void {
    if (!classes) return;
    if (!this.el.nativeElement.classList) return;
    this.el.nativeElement.classList.add(...classes.split(' ').map(c => c.trim()).filter(c => c));
  }

  private removeHighlightClass(classes: string): void {
    if (!classes) return;
    if (!this.el.nativeElement.classList) return;
    this.el.nativeElement.classList.remove(...classes.split(' ').map(c => c.trim()).filter(c => c));
  }

  ngOnDestroy(): void {
    if (this.hightLightSubscription) {
      this.hightLightSubscription.unsubscribe();
    }
  }

}
