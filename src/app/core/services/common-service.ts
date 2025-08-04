import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public triggerValidationUpdate(formGroup: any): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.triggerValidationUpdate(control);
      } else if (control) {
        control.markAsTouched({ emitEvent: true });
        control.updateValueAndValidity({ emitEvent: true });
      }
    });
  }
}
