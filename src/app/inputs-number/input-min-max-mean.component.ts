import { Component, Input, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import 'zone.js';
import { Subject, startWith, takeUntil } from 'rxjs';
import {
  InputNumberFieldsType,
  MinMax,
  MinMaxForm,
  MinMaxMean,
  MinMaxMeanForm,
  TxUnit,
  Standard,
} from './models';
import {
  betweenLowerAndUpper,
  isMinMax,
  isMinMaxMean,
  lowerThanUpper,
} from './utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TxInputNumberComponent } from './input-number.component';
import { CustomMatInput } from '../../mat-form-field-control.directive';
import { MatInputModule } from '@angular/material/input';
import { TxInputSelectComponent } from '../input-select/input-select.component';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTooltipModule,
    MatFormFieldModule,
    TxInputNumberComponent,
    TxInputSelectComponent,
    CustomMatInput,
    MatInputModule,
  ],
  templateUrl: './input-min-max-mean.component.html',
  styleUrl: './input-min-max-mean.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputMinMaxMeanComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: InputMinMaxMeanComponent,
      multi: true,
    },
  ],
})
export class InputMinMaxMeanComponent
  implements ControlValueAccessor, OnDestroy, Validator
{
  @Input() label = '';
  @Input() minLabel = '';
  @Input() maxLabel = '';
  @Input() meanLabel = '';
  @Input() labelTooltip: string | undefined;
  @Input() hintLabel = '';
  @Input() units: TxUnit[] = [];
  @Input() required = false;
  form: FormGroup | undefined;
  fieldsType: InputNumberFieldsType = InputNumberFieldsType.MinMax;
  InputNumberFieldsType = InputNumberFieldsType;
  _destroying$ = new Subject<void>();
  onValidationChange: () => void = () => {};
  get displayFormLabel(): boolean {
    return this.form?.controls['max'] !== undefined;
  }
  get standardControl() {
    return this.form?.get('standard') as FormControl;
  }
  get minControl() {
    return this.form?.get('min') as FormControl;
  }
  get maxControl() {
    return this.form?.get('max') as FormControl;
  }
  get meanControl() {
    return this.form?.get('mean') as FormControl;
  }
  get unitControl() {
    return this.form?.get('unit') as FormControl;
  }
  writeValue(value: MinMax | MinMaxMean): void {
    if (this.form) {
      this.form?.setValue(value);
    } else {
      const [form, fieldsType] = this.initForm(value);
      this.form = form;
      this.fieldsType = fieldsType;
    }
  }
  registerOnChange(fn: any): void {
    this.form?.valueChanges
      .pipe(takeUntil(this._destroying$), startWith(this.form?.value))
      .subscribe(fn);
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
  ngOnDestroy(): void {
    this._destroying$.next();
  }
  private initForm(
    value: MinMax | MinMaxMean
  ): [
    FormGroup<MinMaxForm> | FormGroup<MinMaxMeanForm>,
    InputNumberFieldsType
  ] {
    if (isMinMaxMean(value)) {
      return [
        new FormGroup<MinMaxMeanForm>({
          min: new FormControl(value.min),
          max: new FormControl(value.max),
          mean: new FormControl(value.mean),
          unit: new FormControl(value.unit),
        }),
        InputNumberFieldsType.MinMaxMean,
      ];
    } else {
      return [
        new FormGroup<MinMaxForm>({
          min: new FormControl(value.min),
          max: new FormControl(value.max),
          unit: new FormControl(value.unit),
        }),
        InputNumberFieldsType.MinMax,
      ];
    }
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (isMinMax(control.value)) {
      const lowerThanUpperErrors = lowerThanUpper(control);
      return !lowerThanUpperErrors &&
        !this.minControl.errors &&
        !this.maxControl.errors
        ? null
        : {
            ...lowerThanUpperErrors,
            ...this.minControl.errors,
            ...this.maxControl.errors,
            ...this.unitControl.errors,
          };
    } else {
      const betweenLowerAndUpperErrors = betweenLowerAndUpper(control);
      return !betweenLowerAndUpperErrors &&
        !this.minControl.errors &&
        !this.maxControl.errors &&
        !this.meanControl.errors
        ? null
        : {
            ...betweenLowerAndUpperErrors,
            ...this.minControl.errors,
            ...this.maxControl.errors,
            ...this.unitControl.errors,
            ...this.meanControl.errors,
          };
    }
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }
}
