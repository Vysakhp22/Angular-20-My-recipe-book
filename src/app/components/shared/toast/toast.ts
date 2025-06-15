import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ToastColor, ToastMessage } from '@core/models/toast.model';
import { ToastService } from '@core/services/toast-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast implements OnInit, OnDestroy {

  protected toast = signal<ToastMessage<ToastColor> | null>(null);
  protected readonly toaster = inject(ToastService);
  protected toasterSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.toasterSubscription = this.toaster.toast$.subscribe((toast: ToastMessage<ToastColor> | null) => {
      console.log('Received toast:', toast);

      if (toast) {
        this.toast.set(toast);
      }
      else {
        this.toast.set(null);
      }
    });
  }

  public get toastClasses() {
    if (!this.toast()) return '';
    switch (this.toast()?.type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'info': return 'alert-info';
      case 'warning': return 'alert-warning';
      default: return '';
    }
  }

  ngOnDestroy() {
    if (this.toasterSubscription) {
      this.toasterSubscription.unsubscribe();
    }
  }

}
