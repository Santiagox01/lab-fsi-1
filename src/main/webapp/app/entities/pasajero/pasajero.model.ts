import dayjs from 'dayjs/esm';

export interface IPasajero {
  id: number;
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
  telefono?: string | null;
  fechaNacimiento?: dayjs.Dayjs | null;
}

export type NewPasajero = Omit<IPasajero, 'id'> & { id: null };
