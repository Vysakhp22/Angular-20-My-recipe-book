import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ToastColor } from '@core/models/toast.model';
import { ToastService } from '@services/toast-service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseErrorHandlerService {

  private toastService = inject(ToastService);

  // #TODO: Need to check if this is the best way to handle errors
  private getFriendlyMessage(code: string): string | null {
    const errorMap: { [key: string]: string } = {
      // Auth errors
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'The password you entered is incorrect.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/email-already-in-use': 'This email is already in use.',
      'auth/weak-password': 'The password is too weak. Use at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Popup was closed before completing the sign-in.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-blocked': 'Popup was blocked by the browser. Allow popups and try again.',
      "auth/invalid-credential": "Invalid credentials",

      // Firestore/others
      'permission-denied': 'You don’t have permission to perform this action.',
      // Add more as needed...
    };

    return errorMap[code] || null;
  }

  public handle(error: FirebaseError | any, fallbackMessage = 'An unexpected error occurred') {
    const message = this.getFriendlyMessage(error?.code) || fallbackMessage;
    this.toastService.showToast({
      message: message,
      type: ToastColor.error
    });
    console.log('Firebase Error:', error); // for dev/debug
  }
}
