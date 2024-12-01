import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SignupComponent } from './Components/signup/signup.component';
import { SigninComponent } from './Components/signin/signin.component';
import { VerifyEmailComponent } from './Components/verify-email/verify-email.component';
import { RecoveryComponent } from './Components/recovery/recovery.component';
import { UserComponent } from './Components/user/user.component';
import { ProductsComponent } from './Components/products/products.component';
import { UsersComponent } from './Components/users/users.component';
import { UserDetailsComponent } from './Components/user-details/user-details.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { SearchComponent } from './Components/search/search.component';
import { CartComponent } from './Components/cart/cart.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'verify', component: VerifyEmailComponent},
  {path: 'recovery', component: RecoveryComponent},
  {path: 'account', component: UserComponent},
  {path: 'products/details/:id', component: ProductDetailsComponent},
  {path: 'products/page/:page', component: ProductsComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'users/page/:page', component: UsersComponent},
  {path: 'users/:id', component: UserDetailsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'search', component: SearchComponent},
  {path: 'cart', component: CartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
