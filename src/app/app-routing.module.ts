import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerCreateComponent } from './customers/customer-create/customer-create.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: 'list', component: CustomerListComponent,canActivate: [AuthGuard] },
  { path: 'create', component: CustomerCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:customerId', component: CustomerCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
