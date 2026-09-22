import dayjs from 'dayjs/esm';

import { IReserva, NewReserva } from './reserva.model';

export const sampleWithRequiredData: IReserva = {
  id: 22571,
  codigo: 'indeed derby',
  fechaReserva: dayjs('2026-09-22T08:59'),
  estado: 'starch prestigious meanwhile',
};

export const sampleWithPartialData: IReserva = {
  id: 7546,
  codigo: 'consequently markup quicker',
  fechaReserva: dayjs('2026-09-22T14:27'),
  estado: 'towards hoot doing',
};

export const sampleWithFullData: IReserva = {
  id: 8504,
  codigo: 'geez steeple willow',
  fechaReserva: dayjs('2026-09-21T17:11'),
  estado: 'govern sometimes unwelcome',
};

export const sampleWithNewData: NewReserva = {
  codigo: 'knavishly unusual brr',
  fechaReserva: dayjs('2026-09-21T20:32'),
  estado: 'monthly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
