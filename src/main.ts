import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InputMinMaxMeanComponent } from './app/inputs-number/input-min-max-mean.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MinMax, TxUnit } from './app/inputs-number/models';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputMinMaxMeanComponent, ReactiveFormsModule, FormsModule],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
    <app-input-number
      [label]="inputLabel"
      [formControl]="control"
      [units]="units"
      ><app-input-number />
    </app-input-number>
  `,
})
export class App implements OnInit {
  ngOnInit(): void {
    this.control.valueChanges
      .pipe(tap((val) => console.log(this.control.errors)))
      .subscribe();
  }
  name = 'Angular';
  inputLabel = 'Bassetti Numbers';
  control = new FormControl<MinMax>({ min: 3, max: 6, unit: 1 });
  units: TxUnit[] = [
    { name: 'cm', id: 1 },
    { name: 'l', id: 2 },
    { name: 'feet', id: 3 },
  ];
}

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
