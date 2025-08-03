import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { C } from 'node_modules/@angular/cdk/portal-directives.d-DbeNrI5D';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule],
  templateUrl: './add-recipe.html',
  styles: ``
})
export class AddRecipe {

  private readonly dialogRef = inject(MatDialogRef<AddRecipe>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  protected get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  protected recipeForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    ingredients: new FormArray([this.addIngredientGroup()]),
    instructions: new FormControl('', [Validators.required]),
  });

  protected addIngredient(): void {
    this.ingredients.push(this.addIngredientGroup());
  }

  private addIngredientGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
    });
  }


  protected closeDialog: () => void = (refresh = false) => {
    this.dialogRef.close(refresh);
  }

}
