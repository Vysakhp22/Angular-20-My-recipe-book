import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { REGEX } from '@core/constants/regex.constants';
import { AuthService } from '@core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  protected isformSubmitted: WritableSignal<boolean> = signal(false);
  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(REGEX.email)]),
    password: new FormControl('', [Validators.required])
  });

  constructor(public readonly authService: AuthService) {
  }

  protected onSubmit() {
    this.isformSubmitted.set(true);
    if (this.loginForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    // Handle form submission logic here
    console.log('Form Submitted!', this.loginForm.value);
    const formData = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || ''
    };
    this.authService.login(formData).subscribe({
      next: (userCredential) => {
        console.log('Login successful:', userCredential);
        // Handle successful login, e.g., redirect to dashboard
      },
      error: (error) => {
        console.error('Login failed:', error);
        // Handle login error, e.g., show an error message
      }
    });

  }

  protected googleLogin() {
    this.authService.googleLoginAsync().then(user => {
      console.log('Google login successful:', user);
      // Handle successful Google login, e.g., redirect to dashboard
    }).catch(error => {
      console.error('Google login failed:', error);
      // Handle Google login error, e.g., show an error message
    });
  }

}
