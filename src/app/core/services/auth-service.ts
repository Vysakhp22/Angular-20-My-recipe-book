import { Injectable } from '@angular/core';
import { Auth, browserSessionPersistence, GoogleAuthProvider, setPersistence, signInWithEmailAndPassword, signInWithPopup, User, user, UserCredential } from '@angular/fire/auth';
import { IUserLogin } from '@core/models/user.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$!: Observable<User | null>;

  constructor(
    private readonly firebaseAuth: Auth
  ) {
    this.user$ = user(this.firebaseAuth);
    this.setSessionStoragePersistence();
  }

  private setSessionStoragePersistence(): void {
    try {
      setPersistence(this.firebaseAuth, browserSessionPersistence);
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
}
