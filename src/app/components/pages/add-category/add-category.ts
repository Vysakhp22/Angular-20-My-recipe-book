import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidationHighlight } from '@core/directives/validation-highlight';
import { ToastColor } from '@core/models/toast.model';
import { CategoryService } from '@core/services/category-service';
import { ToastService } from '@core/services/toast-service';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule, ValidationHighlight],
  templateUrl: './add-category.html',
  styles: ``
})
export class AddCategory {

  protected readonly dialogRef = inject(MatDialogRef<AddCategory>);
  protected readonly categoryService = inject(CategoryService);
  protected readonly toaster = inject(ToastService);

  protected categoryName: string = '';
  protected showError = signal(false);

  protected closeDialog(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }

  protected addCategory(): void {
    this.showError.set(!this.categoryName.trim());
    if (this.categoryName.trim()) {
      this.categoryService.addCategoryAsync(this.categoryName.trim()).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.showToast({
              type: ToastColor.success,
              message: `Category added successfully!`
            });
            this.closeDialog(true);
          } else {
            this.toaster.showToast({ type: ToastColor.error, message: response.error || 'Failed to add category' });
          }
        },
        error: (error) => {
          console.error('Error adding category:', error);
          this.toaster.showToast({ type: ToastColor.error, message: 'An unexpected error occurred while adding the category.' });
        }
      });
    }
  }

}
