import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./components/pages/login/login').then(m => m.Login),
        title: 'Login'
    },
    {
        path: 'register',
        title: 'Register',
        loadComponent: () => import('./components/pages/user-register/user-register').then(m => m.UserRegister)
    }

];
