import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { ApiResponse } from '@core/models/base-response.model';
import { IRecipe, IRecipeResponse } from '@core/models/commom.model';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private static readonly collectionName = 'recipes';

  private readonly fireStore = inject(Firestore);

  constructor() { }

  public addRecipeAsync(recipe: IRecipe): Observable<ApiResponse<IRecipeResponse>> {
    if (!recipe || !recipe.title || !recipe.category || !recipe.duration || !recipe.ingredients.length || !recipe.instructions) {
      return new Observable(observer => {
        observer.next({ success: false, error: 'Invalid recipe data' });
        observer.complete();
      });
    }

    const recipeRef = collection(this.fireStore, RecipeService.collectionName);
    const recipeData = {
      ...recipe,
      userId: 'currentUserId', // #TODO Replace with actual user ID logic
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Observable(observer => {
      addDoc(recipeRef, recipeData)
        .then(docRef => {
          observer.next({ success: true, data: { ...recipeData, id: docRef.id } });
          observer.complete();
        })
        .catch(error => {
          observer.next({ success: false, error: error.message });
          observer.complete();
        });
    });
  }

  public getRecipesAsync(): Observable<ApiResponse<IRecipeResponse[]>> {
    const recipeRef = collection(this.fireStore, RecipeService.collectionName);

    return collectionData(recipeRef, { idField: 'id' }).pipe(
      map(recipes => ({ success: true, data: recipes as IRecipeResponse[] })),
      catchError(error => of({ success: false, error: error.message }))
    );
  }

  public getRecipeByIdAsync(id: string): Observable<ApiResponse<IRecipeResponse>> {
    const recipeDocRef = collection(this.fireStore, RecipeService.collectionName);
    const recipeQuery = query(recipeDocRef, where('id', '==', id));
    return from(getDocs(recipeQuery)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return { success: false, error: 'Recipe not found' };
        }
        const recipe = snapshot.docs[0].data() as IRecipeResponse;
        return { success: true, data: { ...recipe, id: snapshot.docs[0].id } };
      }),
      catchError(error => of({ success: false, error: error.message }))
    );
  }

  public updateRecipeAsync(id: string, recipe: Partial<IRecipe>): Observable<ApiResponse<IRecipeResponse>> {
    if (!id || !recipe) {
      return of({ success: false, error: 'Invalid recipe ID or data' });
    }

    const recipeDocRef = doc(this.fireStore, RecipeService.collectionName, id);


    return from(updateDoc(recipeDocRef, {
      ...recipe,
      updatedAt: new Date(),
    })).pipe(
      map(() => ({
        success: true, data: {
          ...recipe,
          id,
          userId: 'currentUserId', // #TODO Replace with actual user ID logic
          createdAt: new Date(), // This should ideally come from the existing document
          updatedAt: new Date()
        } as IRecipeResponse
      })),
      catchError(error => of({ success: false, error: error.message }))
    );
  }
}


