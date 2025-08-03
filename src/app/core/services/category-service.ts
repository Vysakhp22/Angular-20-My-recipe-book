import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs, query, Timestamp, where } from '@angular/fire/firestore';
import { ApiResponse } from '@core/models/base-response.model';
import { catchError, from, map, Observable, of, Subscriber, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private static readonly collectionName = 'categories';

  private readonly fireStore = inject(Firestore);

  private checkIfCategoryExists(categoryName: string): Promise<{ exists: boolean; message?: string; details?: any }> {
    const categoryRef = collection(this.fireStore, CategoryService.collectionName);

    return new Promise(async (resolve, reject) => {
      const q = query(categoryRef, where('name', '==', categoryName.trim().toLowerCase()));

      try {
        const existing = await getDocs(q);
        if (!existing.empty) {
          return resolve({ exists: true });
        }

        return resolve({ exists: false });

      } catch (error) {
        return reject({ message: 'Failed to check category existence', details: error, exists: true });
      }
    });
  }


  public addCategoryAsync(categoryName: string): Observable<ApiResponse<{ id?: string }>> {
    if (!categoryName) {
      return of({ success: false, error: 'Category name cannot be empty' });
    }

    return from(this.checkIfCategoryExists(categoryName)).pipe(
      switchMap((result) => {
        if (result.exists) {
          return of({ success: false, error: 'Category already exists' });
        }

        const categoryRef = collection(this.fireStore, CategoryService.collectionName);

        const categoryData = {
          name: categoryName,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        return new Observable((observer: Subscriber<ApiResponse<{ id?: string, details?: any }>>) => {
          addDoc(categoryRef, categoryData)
            .then(docRef => {
              observer.next({ success: true, data: { id: docRef.id } });
              observer.complete();
            })
            .catch(error => {
              observer.next({ success: false, error: 'Failed to add category', details: error });
              observer.complete();
            });
        });
      }),
      catchError((error) => {
        return of({ success: false, error: 'An error occurred while adding category', details: error });
      })
    );
  }

  public getCategoriesAsync(): Observable<ApiResponse<any[]>> {
    const categoriesCollection = collection(this.fireStore, CategoryService.collectionName);
    return collectionData(categoriesCollection, { idField: 'id' }).pipe(map(categories => {
      return { success: true, data: categories };
    }), catchError(error => {
      return of({ success: false, error: 'Failed to fetch categories', details: error });
    }));
  }

  public deleteCategoryAsync(categoryId: string): Observable<ApiResponse> {
    if (!categoryId) {
      return of({ error: 'Category ID cannot be empty', success: false });
    }
    const categoryDocRef = doc(this.fireStore, 'categories', categoryId);

    return new Observable((observer) => {
      deleteDoc(categoryDocRef)
        .then(() => {
          observer.next({ success: true });
          observer.complete();
        })
        .catch(error => {
          observer.error({ error: 'Failed to delete category', details: error, success: false });
          observer.complete();
        });
    });

  }
}
