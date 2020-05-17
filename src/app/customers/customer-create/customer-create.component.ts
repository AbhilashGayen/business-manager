import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms'
import { CustomersService } from '../customers.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Customer } from '../customer.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})

export class CustomerCreateComponent implements OnInit, OnDestroy {

  name: string;
  address: string;
  contact: string;
  gst: string;
  customer: Customer;
  isLoading = false;
  imagePreview: any;
  imageButtonTitle: string = 'Pick Image';
  form: FormGroup;
  private mode: string = 'create';
  private customerId: string;
  private authStatusSub: Subscription;

  constructor(public customersService: CustomersService, public route: ActivatedRoute, private authService: AuthService) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      'name': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'address': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      'contact': new FormControl(null),
      'gst': new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('customerId')) {
        this.mode = 'edit';
        this.customerId = paramMap.get('customerId');
        this.isLoading = true;
        this.customersService.getCustomer(this.customerId).subscribe(customerData => {
          this.customer = {
            id: customerData._id,
            name: customerData.name,
            address: customerData.address,
            imagePath: customerData.imagePath,
            contact: customerData.contact,
            gst: customerData.gst,
            creator: customerData.creator
          };
          this.isLoading = false;
          this.form.setValue({ name: this.customer.name, address: this.customer.address, image: this.customer.imagePath,
          contact: this.customer.contact, gst: this.customer.gst })
        });
      }
      else {
        this.mode = 'create';
        this.customerId = null;
      }
    });
  }


  onSaveCustomer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.customersService.addCustomer(
        this.form.value.name,
        this.form.value.address,
        this.form.value.image,
        this.form.value.contact,
        this.form.value.gst
      );
    }
    else {
      this.customersService.updateCustomer(this.customerId, this.form.value.name, this.form.value.address, this.form.value.image,
        this.form.value.contact, this.form.value.gst);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageButtonTitle = 'Update Image';
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
