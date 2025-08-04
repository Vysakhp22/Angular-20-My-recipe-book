import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationHighlight } from '@core/directives/validation-highlight';
import { CommonService } from '@core/services/common-service';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule, ValidationHighlight],
  templateUrl: './add-recipe.html',
  styles: ``
})
export class AddRecipe {

  private readonly dialogRef = inject(MatDialogRef<AddRecipe>);
  public readonly dialogData: { categories: any; } = inject(MAT_DIALOG_DATA);
  private readonly commonService = inject(CommonService);

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

  protected closeDialog = (refresh = false): void => {
    this.dialogRef.close(refresh);
  }

  protected onSubmit(): void {
    this.commonService.triggerValidationUpdate(this.recipeForm);
    if (this.recipeForm.valid) {
      // Handle form submission
      console.log(this.recipeForm.value);
      this.closeDialog(true);
    }
  }

}
