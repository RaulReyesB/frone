import { Routes } from '@angular/router';
import { authGuard } from './utils/auth.guard';

export const routes: Routes = [
    {
        path: 'signIn',
        title: 'SignIn',
        loadComponent: () => import('./components/auth/sign-in/sign-in.component')
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./components/auth/login/login.component')
    },
    {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pyComponents/dashboard/dashboard.component'),
        canActivate: [authGuard],
        children: [
            {
                path: 'user',
                title: 'User',
                loadComponent: () => import('./pyComponents/dashboard/pages/user/user.component'),
                canActivate: [authGuard]
            },
            {
                path: 'materials',
                title: 'Material',
                loadComponent: () => import('./pyComponents/dashboard/pages/materials/materials.component'),
                canActivate: [authGuard]
            },
            {
                path: 'loans',
                title: 'Loans',
                loadComponent: () => import('./pyComponents/dashboard/pages/loans/loans.component'),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: 'confirmed',
        loadComponent: () => import('./resource/confirmed/confirmed.component')
    },
    {
        path: 'noConfirmed',
        loadComponent: () => import('./resource/noConfirmed/noConfirmed.component')
    },
    {
        path:'**',
        redirectTo:'login',
        pathMatch:'full'
    }
];
