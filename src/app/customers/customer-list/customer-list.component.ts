import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Customer } from '../customer.model'
import { CustomersService } from '../customers.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})


export class CustomerListComponent implements OnInit, OnDestroy {

  customers: Customer[] = [];
  isLoading = false;
  totalCustomers = 0;
  customersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]
  userAuthenticated = false;
  userId: string;
  private customerSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public customerService: CustomersService, private authService: AuthService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.customerService.getCustomers(this.customersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.customerSub = this.customerService.getCustomersUpdateListner()
      .subscribe((customerData: { customers: Customer[], customerCount: number }) => {
        this.customers = customerData.customers;
        this.totalCustomers = customerData.customerCount;
        this.isLoading = false;
      });
      this.userAuthenticated= this.authService.getIsAuth();
    this.authService.getAuthStatusListner().subscribe(isAuthneticated => {
      this.userAuthenticated = isAuthneticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(customerId: string) {
    this.isLoading = true;
    this.customerService.deleteCustomer(customerId).subscribe(() => {
      this.customerService.getCustomers(this.customersPerPage, this.currentPage);
    }, ()=>{
    this.isLoading=false;
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.customersPerPage = pageData.pageSize;
    this.customerService.getCustomers(this.customersPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
    if(this.authStatusSub){
    this.authStatusSub.unsubscribe();
    }
  }
}
