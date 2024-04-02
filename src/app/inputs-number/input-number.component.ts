import { Component, Input, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import 'zone.js';
import { Subject, startWith, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { checkBoundValue } from './utils';

@Component({
  selector: 'tx-input-number',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
  ],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TxInputNumberComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TxInputNumberComponent,
      multi: true,
    },
  ],
})
export class TxInputNumberComponent
  implements ControlValueAccessor, OnDestroy, Validator
{
  @Input() hintLabel = '';
  @Input() label = '';
  @Input() labelTooltip: string | undefined;
  @Input() lowerBound: number | undefined;
  @Input() upperBound: number | undefined;
  @Input() lowerBoundIncluded: boolean = false;
  @Input() upperBoundIncluded: boolean = false;
  @Input() required: boolean = false;
  control: FormControl | undefined;
  private _destroying$ = new Subject<void>();
  onValidationChange: () => void = () => {};
  writeValue(value: number): void {
    if (this.control) {
      this.control.setValue(value);
    } else {
      this.control = new FormControl(value);
    }
  }
  registerOnChange(fn: any): void {
    this.control?.valueChanges
      .pipe(takeUntil(this._destroying$), startWith(this.control?.value))
      .subscribe(fn);
  }
  registerOnTouched(fn: any): void {} //TODO: implements focus in focus out
  //TODO implements autocompleteValues
  setDisabledState?(isDisabled: boolean): void {}
  onFocusIn($event: any): void {}
  onFocusOut($event: any): void {}
  onKeyUp($event: any): void {}
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const requiredError = Validators.required(control);
    const checkBoundValueError = checkBoundValue(
      this.lowerBound,
      this.upperBound,
      this.lowerBoundIncluded,
      this.upperBoundIncluded
    )(control);

    return !requiredError && !checkBoundValueError
      ? null
      : { ...requiredError, ...checkBoundValueError };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }
  ngOnDestroy(): void {
    this._destroying$.next();
  }
}
