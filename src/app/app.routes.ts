import { Routes } from '@angular/router';
import { AdminPage } from './admin/admin.page';
import { LoginPage } from './login/login.page';
import { UsuarioPage } from './usuario/usuario.page';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
  {
    path: 'usuario',
    component: UsuarioPage,
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
];