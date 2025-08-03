import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Countup } from '@core/directives/countup';
import { DashboardRecentRecipes } from "../dashboard-recent-recipes/dashboard-recent-recipes";
import { AddCategory } from '../add-category/add-category';
import { CategoryService } from '@core/services/category-service';
import { ToastService } from '@core/services/toast-service';
import { ToastColor } from '@core/models/toast.model';

@Component({
  selector: 'app-dashboard-widget',
  imports: [Countup, DashboardRecentRecipes, MatDialogModule],
  templateUrl: './dashboard-widget.html',
  styles: ``
})
export class DashboardWidget implements OnInit {

  ngOnInit(): void {
    this.getCategoriesCount();
  }

  private readonly dialog = inject(MatDialog);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(ToastService);
  protected categoriesCount = signal<number>(0);

  protected openDialog(): void {
    this.dialog.open(AddCategory, {
      width: '500px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: {},
      disableClose: true,
      autoFocus: false,
    }).afterClosed().subscribe((result: boolean) => result ? this.getCategoriesCount() : null);
  }

  private getCategoriesCount(): void {
    this.categoryService.getCategoriesAsync().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categoriesCount.set(response.data.length);
        } else {
          this.toast.showToast({ message: response.error || 'Failed to fetch categories', type: ToastColor.error });
          console.error('Error fetching categories:', response.error);
        }
      },
      error: (err) => {
        this.toast.showToast({ message: 'An error occurred while fetching categories', type: ToastColor.error });
        console.error('Error fetching categories:', err);
      }
    });
  }

}
