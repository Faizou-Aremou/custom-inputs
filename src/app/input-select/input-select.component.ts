import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { Subject, startWith, takeUntil } from 'rxjs';
@Component({
  selector: 'tx-input-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormField],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TxInputSelectComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TxInputSelectComponent,
      multi: true,
    },
  ],
})
export class TxInputSelectComponent<T extends { name: string; id: number }>
  implements ControlValueAccessor, OnDestroy, Validator
{
  @Input() options: T[] = [];
  @Input() required = false;
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
      .pipe(startWith(this.control.value), takeUntil(this._destroying$))
      .subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const requiredError = Validators.required(control);
    return requiredError;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }
  ngOnDestroy(): void {
    this._destroying$.next();
  }
}
