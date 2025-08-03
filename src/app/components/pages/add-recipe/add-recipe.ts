import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule, NgClass],
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

protected closeDialog = (refresh = false): void => {
    this.dialogRef.close(refresh);
  }


  protected onSubmit(): void {
    if (this.recipeForm.valid) {
      // Handle form submission
      console.log(this.recipeForm.value);
      this.closeDialog(true);
    } else {
      // Mark all fields as touched to show validation errors
      // this.markFormGroupTouched(this.recipeForm);
    }
  }

  // private markFormGroupTouched(formGroup: FormGroup): void {
  //   Object.keys(formGroup.controls).forEach(key => {
  //     const control = formGroup.get(key);
  //     control?.markAsTouched();

  //     if (control instanceof FormGroup) {
  //       this.markFormGroupTouched(control);
  //     } else if (control instanceof FormArray) {
  //       control.controls.forEach(arrayControl => {
  //         if (arrayControl instanceof FormGroup) {
  //           this.markFormGroupTouched(arrayControl);
  //         } else {
  //           arrayControl.markAsTouched();
  //         }
  //       });
  //     }
  //   });
  // }

}
