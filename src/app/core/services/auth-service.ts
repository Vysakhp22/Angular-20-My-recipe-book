import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { IUserLogin, IUserRegister } from '@core/models/user.model';
import { from, Observable } from 'rxjs';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  User,
  UserCredential,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$!: Observable<User | null>;

  constructor(
    private readonly firebaseAuth: Auth,
    private readonly firestore: Firestore
  ) {
    this.user$ = user(this.firebaseAuth);
    this.setSessionStoragePersistence();
  }

  private async setSessionStoragePersistence(): Promise<void> {
    try {
      await setPersistence(this.firebaseAuth, browserSessionPersistence);
    } catch (error) {
      console.error('Error setting session storage persistence:', error);
    }
  }

  public login(loginData: IUserLogin): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, loginData.email, loginData.password));
  }

  public logout(): Observable<void> {
    sessionStorage.clear();
    return from(this.firebaseAuth.signOut());
  }

  public async googleLoginAsync(): Promise<User> {
    try {
      return await this.googleLogin();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  private async googleLogin() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.firebaseAuth, provider);
    const user = result.user;
    if (!user) {
      throw new Error('Google login failed: No user returned');
    }
    console.log('Google login successful:', user);
    return user;

  }

  public async onRegister(userData: IUserRegister): Promise<User> {
    try {
      const UserCredential = await createUserWithEmailAndPassword(this.firebaseAuth, userData.email, userData.password);
      if (!UserCredential.user) {
        throw new Error('Registration failed: No user returned');
      }
      const userDataToSave = {
        name: userData.name,
        email: userData.email,
        uid: UserCredential.user.uid,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(this.firestore, `users/${UserCredential.user.uid}`), userDataToSave)

      return UserCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}
