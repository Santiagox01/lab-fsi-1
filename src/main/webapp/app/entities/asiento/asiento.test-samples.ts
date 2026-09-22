import { IAsiento, NewAsiento } from './asiento.model';

export const sampleWithRequiredData: IAsiento = {
  id: 13756,
  numero: 'apropos pfft tremendously',
  clase: 'moral to',
  disponible: true,
};

export const sampleWithPartialData: IAsiento = {
  id: 9076,
  numero: 'nor',
  clase: 'oddly',
  disponible: true,
};

export const sampleWithFullData: IAsiento = {
  id: 26443,
  numero: 'geez unique than',
  clase: 'glossy',
  disponible: true,
};

export const sampleWithNewData: NewAsiento = {
  numero: 'bitterly source impolite',
  clase: 'covenant',
  disponible: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
