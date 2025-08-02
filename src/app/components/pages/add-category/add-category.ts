import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule],
  templateUrl: './add-category.html',
  styles: ``
})
export class AddCategory {

  protected readonly dialogRef = inject(MatDialogRef<AddCategory>);

  protected categoryName: string = '';

  protected closeDialog(): void {
    this.dialogRef.close();
  }

}
