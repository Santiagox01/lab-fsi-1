import dayjs from 'dayjs/esm';

import { IVuelo, NewVuelo } from './vuelo.model';

export const sampleWithRequiredData: IVuelo = {
  id: 24977,
  numeroVuelo: 'slipper boring',
  origen: 'boo',
  destino: 'unexpectedly cone',
  fechaSalida: dayjs('2026-09-21T22:33'),
  fechaLlegada: dayjs('2026-09-21T21:40'),
};

export const sampleWithPartialData: IVuelo = {
  id: 2574,
  numeroVuelo: 'likewise',
  origen: 'regulate',
  destino: 'glittering yippee',
  fechaSalida: dayjs('2026-09-22T08:19'),
  fechaLlegada: dayjs('2026-09-22T12:00'),
};

export const sampleWithFullData: IVuelo = {
  id: 18116,
  numeroVuelo: 'silently without screw',
  origen: 'whenever',
  destino: 'cow if mmm',
  fechaSalida: dayjs('2026-09-22T09:10'),
  fechaLlegada: dayjs('2026-09-22T01:54'),
};

export const sampleWithNewData: NewVuelo = {
  numeroVuelo: 'eke boohoo yesterday',
  origen: 'absent decent',
  destino: 'pendant',
  fechaSalida: dayjs('2026-09-22T13:06'),
  fechaLlegada: dayjs('2026-09-22T09:45'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
