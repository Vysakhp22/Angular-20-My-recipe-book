import { Component, signal, WritableSignal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX } from '@core/constants/regex.constants';
import { ToastColor } from '@core/models/toast.model';
import { AuthService } from '@core/services/auth-service';
import { FirebaseErrorHandlerService } from '@core/services/firebase-error-handler-service';
import { ToastService } from '@core/services/toast-service';

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

  constructor(
    public readonly authService: AuthService,
    public readonly router: Router,
    private readonly toastService: ToastService,
    private readonly firebaseErrorHandler: FirebaseErrorHandlerService
  ) { }

  protected onSubmit() {
    this.isformSubmitted.set(true);
    if (this.loginForm.invalid) {
      this.toastService.showToast({
        message: 'Please fill in all required fields correctly.',
        type: ToastColor.warning
      });
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
        this.toastService.showToast({
          message: 'Login successful!',
          type: ToastColor.success
        });
      },
      error: (error: FirebaseError) => {
        this.firebaseErrorHandler.handle(error, 'Login failed. Please check your credentials and try again.');
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
