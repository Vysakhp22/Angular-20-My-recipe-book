import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
        },
        error: (error) => {
          console.error('Error adding category:', error);
          // Optionally, you could show an error message to the user here
        }
      });
    }
  }

}
