import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MinMax, MinMaxForm, MinMaxMean} from './models';

export function isMinMax(value: MinMax | MinMaxMean): value is MinMax {
  return (value as MinMaxMean).mean === undefined;
}
export function isMinMaxMean(value: MinMax | MinMaxMean): value is MinMaxMean {
  return (value as MinMaxMean).mean !== undefined;
}
form: FormGroup<MinMaxForm>;

export function lowerThanUpper(
  control: AbstractControl
): ValidationErrors | null {
  const canBeValidate = canBeValidateAsMinMaxValues(control);
  if (canBeValidate) {
    const minValue = control.value.min ?? 0;
    const maxValue = control.value.max ?? 0;
    const isValid = minValue <= maxValue;
    return isValid ? null : { minUpperThanMax: true };
  }
  return { notAValidControl: true };
}

export function betweenLowerAndUpper(
  control: AbstractControl
): ValidationErrors | null {
  const canBeValidate = canBeValidateAsMinMaxMeanValues(control);
  if (canBeValidate) {
    const minValue = control.value.min ?? 0;
    const maxValue = control.value.max ?? 0;
    const meanValue = control.value.mean ?? 0;
    const meanBetweenMinAndMax = meanValue <= maxValue && meanValue >= minValue;
    return meanBetweenMinAndMax
      ? null
      : {
          meanOutOfMinAndMax: true,
        };
  }
  return { notAValidControl: true };
}

export function checkBoundValue(
  lowerBound: number | undefined,
  upperBound: number | undefined,
  lowerBoundIncluded: boolean = false,
  upperBoundIncluded: boolean = false
): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (typeof value === 'number') {
      const lowerBoundError = lowerBound
        ? validLowerValue(value, lowerBound, lowerBoundIncluded)
        : null;
      const upperBoundError = upperBound
        ? validUpperValue(value, upperBound, upperBoundIncluded)
        : null;
      return !lowerBoundError && !upperBoundError
        ? null
        : { ...lowerBoundError, ...upperBoundError };
    }
    return { isNotValidValueType: value };
  };
}

function validLowerValue(
  value: number,
  lowerBound: number,
  lowerBoundIncluded: boolean
) {
  const isValid = lowerBoundIncluded ? value <= lowerBound : value < lowerBound;
  return isValid ? null : { isLowThanLowBoundValue: lowerBound };
}
function validUpperValue(
  value: number,
  upperBound: number,
  upperBoundIncluded: boolean
) {
  const isValid = upperBoundIncluded ? value >= upperBound : value > upperBound;
  return isValid ? null : { isSupThanUpperBoundValue: upperBound };
}

function canBeValidateAsMinMaxValues(control: AbstractControl): boolean {
  return (
    control.value.min !== undefined &&
    typeof control.value.min === 'number' &&
    control.value.max !== undefined &&
    typeof control.value.max === 'number'
  );
}
function canBeValidateAsMinMaxMeanValues(control: AbstractControl): boolean {
  return (
    control.value.min !== undefined &&
    typeof control.value.min === 'number' &&
    control.value.max !== undefined &&
    typeof control.value.max === 'number' &&
    control.value.mean !== undefined &&
    typeof control.value.mean === 'number'
  );
}
