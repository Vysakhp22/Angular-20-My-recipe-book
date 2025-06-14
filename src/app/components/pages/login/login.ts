import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  protected onSubmit() {
    if (this.loginForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    // Handle form submission logic here
    console.log('Form Submitted!', this.loginForm.value);

  }

}
