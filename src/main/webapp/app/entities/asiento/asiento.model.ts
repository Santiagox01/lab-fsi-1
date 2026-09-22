export interface IAsiento {
  id: number;
  numero?: string | null;
  clase?: string | null;
  disponible?: boolean | null;
}

export type NewAsiento = Omit<IAsiento, 'id'> & { id: null };
