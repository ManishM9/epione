import { NgModule } from '@angular/core';

import { RouterModule, Routes, Router } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [
    RouterModule.forRoot(routes),
  ],
  declarations: []
})
export class AppRoutingModule {
  


}
