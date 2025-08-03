import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { rxResource } from '@angular/core/rxjs-interop';
import { Countup } from '@core/directives/countup';
import { DashboardRecentRecipes } from "../dashboard-recent-recipes/dashboard-recent-recipes";
import { AddCategory } from '../add-category/add-category';
import { CategoryService } from '@core/services/category-service';
import { ToastService } from '@core/services/toast-service';
import { ToastColor } from '@core/models/toast.model';
import { ApiResponse } from '@core/models/base-response.model';
import { AddRecipe } from '../add-recipe/add-recipe';

@Component({
  selector: 'app-dashboard-widget',
  imports: [Countup, DashboardRecentRecipes, MatDialogModule],
  templateUrl: './dashboard-widget.html',
  styles: ``
})
export class DashboardWidget implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(ToastService);

  protected categoriesCount = signal(0);

  constructor() {
    effect(() => {

      if (this.categories.value()?.success) {
        this.categoriesCount.set(this.categories.value()?.data?.length || 0);
      } else if (this.categories.value()?.error) {
        this.toast.showToast({
          type: ToastColor.error,
          message: this.categories.value()?.error || 'Failed to load categories'
        });
      }
    });

  }

  ngOnInit(): void {
    // this.getCategoriesCount();
  }

  protected openAddCategoryDialog(): void {
    this.dialog.open(AddCategory, {
      width: '500px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: {},
      disableClose: true,
      autoFocus: false,
    }).afterClosed().subscribe((result: boolean) => result ? this.categories.reload() : null);
  }

  protected categories = rxResource<ApiResponse, undefined>({
    stream: () => this.categoryService.getCategoriesAsync()
  });

  protected openAddRecipeDialog = (): void => {
    this.dialog.open(AddRecipe, {
      width: '500px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: {
        categories: this.categories.value()?.data || []
      },
      disableClose: true,
      autoFocus: false,
    })
    // .afterClosed().subscribe((result: boolean) => result ? this.categories.reload() : null);
  }

}
