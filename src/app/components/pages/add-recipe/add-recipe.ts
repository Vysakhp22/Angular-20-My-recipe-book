import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule],
  templateUrl: './add-recipe.html',
  styles: ``
})
export class AddRecipe {

  private readonly dialogRef = inject(MatDialogRef<AddRecipe>);
  public readonly dialogData: { categories: any; } = inject(MAT_DIALOG_DATA);

  constructor() {
    this.createForm();
  }

  protected get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  protected recipeForm!: FormGroup;

  protected createForm(): void {
    this.recipeForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      ingredients: new FormArray([this.addIngredientGroup()]),
      instructions: new FormControl('', [Validators.required]),
    });
  }

  protected addIngredient(): void {
    this.ingredients.push(this.addIngredientGroup());
  }

  private addIngredientGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
    });
  }

  protected removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
    this.ingredients.updateValueAndValidity();
  }


  protected closeDialog: () => void = (refresh = false) => {
    this.dialogRef.close(refresh);
  }

}
