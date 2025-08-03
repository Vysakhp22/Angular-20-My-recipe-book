import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastColor } from '@core/models/toast.model';
import { CategoryService } from '@core/services/category-service';
import { ToastService } from '@core/services/toast-service';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule],
  templateUrl: './add-category.html',
  styles: ``
})
export class AddCategory {

  protected readonly dialogRef = inject(MatDialogRef<AddCategory>);
  protected readonly categoryService = inject(CategoryService);
  protected readonly toaster = inject(ToastService);

  protected categoryName: string = '';

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected addCategory(): void {
    if (this.categoryName.trim()) {
      this.categoryService.addCategoryAsync(this.categoryName.trim()).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.showToast({
              type: ToastColor.success,
              message: `Category added successfully!`
            });
            this.dialogRef.close(response.data);
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
