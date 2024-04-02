import { FormControl } from '@angular/forms';

export enum InputNumberFieldsType {
  MinMax = 'minMax',
  MinMaxMean = 'max',
}

export interface Standard {
  standard: number;
  unit: number;
}
export interface MinMax {
  min: number;
  max: number;
  unit: number;
}
export interface MinMaxMean {
  min: number;
  max: number;
  mean: number;
  unit: number;
}

export type ToForm<T> = {
  [P in keyof T]: FormControl<T[P] | null>;
};

export type MinMaxForm = ToForm<MinMax>;
export type MinMaxMeanForm = ToForm<MinMaxMean>;

export interface TxUnit {
  name: string;
  id: number;
}
