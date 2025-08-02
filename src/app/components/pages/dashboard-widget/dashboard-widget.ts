import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Countup } from '@core/directives/countup';
import { DashboardRecentRecipes } from "../dashboard-recent-recipes/dashboard-recent-recipes";
import { AddCategory } from '../add-category/add-category';

@Component({
  selector: 'app-dashboard-widget',
  imports: [Countup, DashboardRecentRecipes, MatDialogModule],
  templateUrl: './dashboard-widget.html',
  styles: ``
})
export class DashboardWidget {

  private dialog = inject(MatDialog);

  protected openDialog(): void {
    this.dialog.open(AddCategory, {
      width: '500px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: {},
      disableClose: true,
      autoFocus: false,
    });
  }

}
