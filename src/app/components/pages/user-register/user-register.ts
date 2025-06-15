import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { REGEX } from '@core/constants/regex.constants';
import { Common } from '@core/services/common';

@Component({
  selector: 'app-user-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-register.html',
  styleUrl: './user-register.scss'
})
export class UserRegister {

  // Custom validator to check if password and confirm password match
  private passwordMatchValidator: (control: AbstractControl) => { mismatch: boolean; } | null = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  protected userRegisterForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(REGEX.email)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: this.passwordMatchValidator });
  protected isformSubmitted: WritableSignal<boolean> = signal(false);


  constructor() {

  }

  // Add methods for handling registration logic, form submission, etc.
  onSubmit() {
    this.isformSubmitted.set(true);
    if (this.userRegisterForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    // Handle form submission
    console.log('Form submitted');
  }

}
