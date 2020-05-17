import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import {  CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['invoice-create.component.scss']
})

export class InvoiceCreateComponent implements OnInit, OnDestroy  {

  name = 'Angular 8 reactive form with dynamic fields and validations example';
  exampleForm: FormGroup;
  totalSum: number = 0;
  myFormValueChanges$;

  constructor(
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe
  ) { }

  /**
   * Form initialization
   */

  ngOnInit () {
    // create form with validators and dynamic rows array
    this.exampleForm = this.formBuilder.group({

      units: this.formBuilder.array([
         // load first row at start
         this.getUnit()
      ])
    });
    // initialize stream on units
    this.myFormValueChanges$ = this.exampleForm.controls['units'].valueChanges;
    // subscribe to the stream so listen to changes on units
    this.myFormValueChanges$.subscribe(units => this.updateTotalUnitPrice(units));
  }

  /**
   * Save form data
   */
  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
    alert('Form data are: ' + JSON.stringify(model));
  }

  /**
   * Create form unit
   */
  private getUnit() {
    const numberPatern = '^[0-9.,]+$';
    return this.formBuilder.group({
      unitName: ['', Validators.required],
      qty: ['', [Validators.required, Validators.pattern(numberPatern)]],
      unitPrice: ['', [Validators.required, Validators.pattern(numberPatern)]],
      unitTotalPrice: [{value: '', disabled: true}]
    });
  }

  /**
   * Add new unit row into form
   */
  addUnit() {
    const control = <FormArray>this.exampleForm.controls['units'];
    control.push(this.getUnit());
  }

  /**
   * Remove unit row from form on click delete button
   */
  removeUnit(i: number) {
    const control = <FormArray>this.exampleForm.controls['units'];
    control.removeAt(i);
  }

  /**
   * This is one of the way how clear units fields.
   */
  clearAllUnits() {
    const control = <FormArray>this.exampleForm.controls['units'];
    while(control.length) {
      control.removeAt(control.length - 1);
    }
    control.clearValidators();
    control.push(this.getUnit());
  }

  private updateTotalUnitPrice(units: any) {
    // get our units group controll
    const control = <FormArray>this.exampleForm.controls['units'];
    // before recount total price need to be reset.
    this.totalSum = 0;
    for (let i in units) {
      let totalUnitPrice = (units[i].qty*units[i].unitPrice);
      // now format total price with angular currency pipe
      let totalUnitPriceFormatted = this.currencyPipe.transform(totalUnitPrice, 'INR', 'symbol-narrow', '1.2-2');
      // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
      control.at(+i).get('unitTotalPrice').setValue(totalUnitPriceFormatted, {onlySelf: true, emitEvent: false});
      // update total price for all units
      this.totalSum += totalUnitPrice;
    }
  }

  /**
   * unsubscribe listener
   */
  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
  }

}
