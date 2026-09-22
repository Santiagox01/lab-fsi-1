import dayjs from 'dayjs/esm';

import { IAsiento } from 'app/entities/asiento/asiento.model';
import { IPasajero } from 'app/entities/pasajero/pasajero.model';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';

export interface IReserva {
  id: number;
  codigo?: string | null;
  fechaReserva?: dayjs.Dayjs | null;
  estado?: string | null;
  vuelo?: IVuelo | null;
  asiento?: IAsiento | null;
  pasajero?: IPasajero | null;
}

export type NewReserva = Omit<IReserva, 'id'> & { id: null };
