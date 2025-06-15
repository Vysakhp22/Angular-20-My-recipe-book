import { Injectable } from '@angular/core';
import { ToastColor, ToastMessage } from '@core/models/toast.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _toast$ = new BehaviorSubject<ToastMessage<ToastColor> | null>(null);
  public toast$ = this._toast$.asObservable();

  public showToast(toast: ToastMessage<ToastColor>) {
    console.log('Sending toast:', toast);
    
    this._toast$.next(toast);
    setTimeout(() => {
      this.hideToast();
    }, 3000); // Automatically hide after 3 seconds
  }

  public hideToast() {
    this._toast$.next(null);
  }

}
