import dayjs from 'dayjs/esm';

export interface IVuelo {
  id: number;
  numeroVuelo?: string | null;
  origen?: string | null;
  destino?: string | null;
  fechaSalida?: dayjs.Dayjs | null;
  fechaLlegada?: dayjs.Dayjs | null;
}

export type NewVuelo = Omit<IVuelo, 'id'> & { id: null };
