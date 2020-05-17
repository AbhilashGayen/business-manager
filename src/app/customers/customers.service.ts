import { Subject } from 'rxjs'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

import { environment } from '../../environments/environment'
import { Customer } from './customer.model'

const BACKEND_URL = environment.apiUrl + '/customers/';


@Injectable({ providedIn: 'root' })
export class CustomersService {
  private customers: Customer[] = [];
  private customerUpdated = new Subject<{ customers: Customer[], customerCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getCustomers(customersPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${customersPerPage}&page=${currentPage}`
    this.http.get<{ message: string, customers: any, maxCustomers: number }>(BACKEND_URL + queryParams)
      .pipe(map((customerData) => {
        return {
          customers: customerData.customers.map(customer => {
            return {
              name: customer.name,
              address: customer.address,
              id: customer._id,
              imagePath: customer.imagePath,
              contact: customer.contact,
              gst: customer.gst,
              creator: customer.creator
            };
          }), maxCustomers: customerData.maxCustomers
        };
      }))
      .subscribe(transformedCustomerData => {
        this.customers = transformedCustomerData.customers;
        this.customerUpdated.next({ customers: [...this.customers], customerCount: transformedCustomerData.maxCustomers });
      });
  }

  getCustomersUpdateListner() {
    return this.customerUpdated.asObservable();
  }

  getCustomer(id: string) {
    return this.http.get<{ _id: string, name: string, address: string, imagePath: string, contact: string, gst:string, creator: string }>(
      BACKEND_URL + id);
  }

  addCustomer(name: string, address: string, image: File, contact: string, gst: string ) {
    const customerData = new FormData();
    customerData.append("name", name);
    customerData.append("address", address);
    customerData.append("image", image, name);
    customerData.append("contact", contact);
    customerData.append("gst", gst);

    this.http.post<{ message: string, customer: Customer }>(BACKEND_URL, customerData)
      .subscribe(responseData => {
        this.router.navigate(['/customer-list']);
      });
  }

  updateCustomer(id: string, name: string, address: string, image: File | string, contact: string, gst: string) {
    let customerData: Customer | FormData;
    if (typeof image == 'object') {
      customerData = new FormData();
      customerData.append('id', id);
      customerData.append("name", name);
    customerData.append("address", address);
    customerData.append("image", image, name);
    customerData.append("contact", contact);
    customerData.append("gst", gst);
    } else {
      customerData = {
        id: id, name: name, address: address, imagePath: <string>image, contact:contact, gst:gst, creator: null
      };
    }
    this.http.put(BACKEND_URL + id, customerData)
      .subscribe(response => {
        this.router.navigate(['/customer-list']);
      });
  }

  deleteCustomer(customerId: string) {
    return this.http.delete(BACKEND_URL + customerId);
  }
}
