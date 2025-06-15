import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX } from '@core/constants/regex.constants';
import { AuthService } from '@core/services/auth-service';

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


  constructor(
    public readonly auth: AuthService,
    private readonly router: Router
  ) {

  }

  // Add methods for handling registration logic, form submission, etc.
  onSubmit() {
    this.isformSubmitted.set(true);
    if (this.userRegisterForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    this.auth.onRegister({
      name: this.userRegisterForm.value.name || '',
      email: this.userRegisterForm.value.email || '',
      password: this.userRegisterForm.value.password || '',
      confirmPassword: this.userRegisterForm.value.confirmPassword || ''
    }).then((user) => {
      console.log('Registration successful:', user);
      // Handle successful registration, e.g., redirect to login or dashboard
      this.userRegisterForm.reset();
      this.isformSubmitted.set(false);
      this.router.navigate(['/login']);
    }
    ).catch(error => {
      console.error('Registration failed:', error);
      // Handle registration error, e.g., show an error message
    });
  }

}
