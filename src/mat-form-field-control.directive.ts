import { Directive } from '@angular/core';
import { NgControl, AbstractControlDirective } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';

@Directive({
  selector: `[customMatInput]`,
  providers: [{ provide: MatFormFieldControl, useExisting: CustomMatInput }],
  standalone: true,
})
export class CustomMatInput implements MatFormFieldControl<any> {
  value: any;
  stateChanges!: Observable<void>;
  id!: string;
  placeholder!: string;
  ngControl!: NgControl | AbstractControlDirective | null;
  focused!: boolean;
  empty!: boolean;
  shouldLabelFloat!: boolean;
  required!: boolean;
  disabled!: boolean;
  errorState!: boolean;
  controlType?: string | undefined;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  setDescribedByIds(ids: string[]): void {
    throw new Error('Method not implemented.');
  }
  onContainerClick(event: MouseEvent): void {
    if (!this.focused) {
      this.focus();
    }
  }

  focus(options?: FocusOptions): void {
    // this._elementRef.nativeElement.focus(options);
  }
}
