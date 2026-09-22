import dayjs from 'dayjs/esm';

import { IPasajero, NewPasajero } from './pasajero.model';

export const sampleWithRequiredData: IPasajero = {
  id: 29575,
  nombre: 'phooey',
  apellido: 'for bus gently',
  email: 'Gretchen.Becker@yahoo.com',
};

export const sampleWithPartialData: IPasajero = {
  id: 24115,
  nombre: 'lest fondly and',
  apellido: 'entrench',
  email: 'Alivia.Hyatt0@yahoo.com',
  telefono: 'shyly profitable elevation',
};

export const sampleWithFullData: IPasajero = {
  id: 4784,
  nombre: 'lucky airport pause',
  apellido: 'anxiously ack',
  email: 'Josh61@gmail.com',
  telefono: 'lady',
  fechaNacimiento: dayjs('2026-09-22'),
};

export const sampleWithNewData: NewPasajero = {
  nombre: 'obedient yearningly',
  apellido: 'arid reassuringly holster',
  email: 'Janice_Cremin@gmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
