import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassportRoutingModule { }
