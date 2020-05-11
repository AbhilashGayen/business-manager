import { NgModule } from "@angular/core";
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations:[
    CustomerCreateComponent,
    CustomerListComponent
],
imports:[
  CommonModule,
  ReactiveFormsModule,
  AngularMaterialModule,
  RouterModule
]
})

export class CustomersModule {

}
