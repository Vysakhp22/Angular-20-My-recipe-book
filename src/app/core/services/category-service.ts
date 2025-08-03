import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs, query, Timestamp, where } from '@angular/fire/firestore';
import { from, Observable, of, Subscriber, switchMap } from 'rxjs';

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


  public addCategoryAsync(categoryName: string): Observable<{ success?: boolean; id?: string; error?: string; details?: any; }> {
    if (!categoryName) {
      return of({ error: 'Category name cannot be empty' });
    }

    return from(this.checkIfCategoryExists(categoryName)).pipe(
      switchMap((result) => {
        if (result.exists) {
          return of({ error: 'Category already exists' });
        }

        const categoryRef = collection(this.fireStore, CategoryService.collectionName);

        const categoryData = {
          name: categoryName,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        return new Observable((observer: Subscriber<{ success?: boolean, id?: string, error?: string, details?: any }>) => {
          addDoc(categoryRef, categoryData)
            .then(docRef => {
              observer.next({ success: true, id: docRef.id });
              observer.complete();
            })
            .catch(error => {
              observer.error({ error: 'Failed to add category', details: error });
            });
        });
      })
    );
  }

  public getCategoriesAsync(): Observable<any[]> {
    const categoriesCollection = collection(this.fireStore, CategoryService.collectionName);
    return collectionData(categoriesCollection, { idField: 'id' });
  }

  public deleteCategoryAsync(categoryId: string): Observable<{ success?: boolean; error?: string; details?: any }> {
    if (!categoryId) {
      return of({ error: 'Category ID cannot be empty' });
    }
    const categoryDocRef = doc(this.fireStore, 'categories', categoryId);

    return new Observable((observer) => {
      deleteDoc(categoryDocRef)
        .then(() => {
          observer.next({ success: true });
          observer.complete();
        })
        .catch(error => {
          observer.error({ error: 'Failed to delete category', details: error });
        });
    });

  }
}
