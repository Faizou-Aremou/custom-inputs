
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { lowerThanUpper, betweenLowerAndUpper, checkBoundValue } from './utils'; // Update this import path accordingly

describe('Custom Validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      min: new FormControl(0),
      max: new FormControl(0),
      mean: new FormControl(0)
    });
  });

  it('should validate lowerThanUpper correctly', () => {
    form.patchValue({ min: 1, max: 5 }); // Set valid values
    expect(lowerThanUpper(form)).toBeNull(); // Expect no errors
    form.patchValue({ min: 5, max: 1 }); // Set invalid values
    expect(lowerThanUpper(form)).toEqual({ minUpperThanMax: true }); // Expect error
  });

  it('should validate betweenLowerAndUpper correctly', () => {
    form.patchValue({ min: 1, max: 5, mean: 3 }); // Set valid values
    expect(betweenLowerAndUpper(form)).toBeNull(); // Expect no errors
    form.patchValue({ min: 1, max: 5, mean: 6 }); // Set invalid values
    expect(betweenLowerAndUpper(form)).toEqual({ meanOutOfMinAndMax: true }); // Expect error
  });

  it('should validate checkBoundValue correctly', () => {
    const validator = checkBoundValue(1, 5); // Define validator with bounds
    let control = new FormControl(3); // Set valid value
    expect(validator(control)).toBeNull(); // Expect no errors
    control = new FormControl(6); // Set invalid value
    expect(validator(control)).toEqual({ isSupThanUpperBoundValue: 5 }); // Expect error
    control = new FormControl(0); // Set invalid value
    expect(validator(control)).toEqual({ isLowThanLowBoundValue: 1 }); // Expect error
  });
});
