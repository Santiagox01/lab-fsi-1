import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT, serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IPasajero, NewPasajero } from '../pasajero.model';

export type PartialUpdatePasajero = Partial<IPasajero> & Pick<IPasajero, 'id'>;

type RestOf<T extends IPasajero | NewPasajero> = Omit<T, 'fechaNacimiento'> & {
  fechaNacimiento?: string | null;
};

export type RestPasajero = RestOf<IPasajero>;

export type NewRestPasajero = RestOf<NewPasajero>;

export type PartialUpdateRestPasajero = RestOf<PartialUpdatePasajero>;

@Service()
export class PasajerosService {
  readonly pasajerosParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly pasajerosResource = httpResource<RestPasajero[]>(() => {
    const params = this.pasajerosParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of pasajero that have been fetched. It is updated when the pasajerosResource emits a new value.
   * In case of error while fetching the pasajeros, the signal is set to an empty array.
   */
  readonly pasajeros = computed(() =>
    (this.pasajerosResource.hasValue() ? this.pasajerosResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/pasajeros`;

  protected convertValueFromServer(restPasajero: RestPasajero): IPasajero {
    return {
      ...restPasajero,
      fechaNacimiento: restPasajero.fechaNacimiento ? dayjs(restPasajero.fechaNacimiento) : undefined,
    };
  }
}

@Service()
export class PasajeroService extends PasajerosService {
  protected readonly http = inject(HttpClient);

  create(pasajero: NewPasajero): Observable<IPasajero> {
    const copy = this.convertValueFromClient(pasajero);
    return this.http.post<RestPasajero>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pasajero: IPasajero): Observable<IPasajero> {
    const copy = this.convertValueFromClient(pasajero);
    return this.http
      .put<RestPasajero>(`${this.resourceUrl}/${encodeURIComponent(this.getPasajeroIdentifier(pasajero))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pasajero: PartialUpdatePasajero): Observable<IPasajero> {
    const copy = this.convertValueFromClient(pasajero);
    return this.http
      .patch<RestPasajero>(`${this.resourceUrl}/${encodeURIComponent(this.getPasajeroIdentifier(pasajero))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IPasajero> {
    return this.http
      .get<RestPasajero>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IPasajero[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPasajero[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPasajeroIdentifier(pasajero: Pick<IPasajero, 'id'>): number {
    return pasajero.id;
  }

  comparePasajero(o1: Pick<IPasajero, 'id'> | null, o2: Pick<IPasajero, 'id'> | null): boolean {
    return o1 && o2 ? this.getPasajeroIdentifier(o1) === this.getPasajeroIdentifier(o2) : o1 === o2;
  }

  addPasajeroToCollectionIfMissing<Type extends Pick<IPasajero, 'id'>>(
    pasajeroCollection: Type[],
    ...pasajerosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pasajeros: Type[] = pasajerosToCheck.filter(pasajeroItem => pasajeroItem !== null && pasajeroItem !== undefined);
    if (pasajeros.length > 0) {
      const pasajeroCollectionIdentifiers = pasajeroCollection.map(pasajeroItem => this.getPasajeroIdentifier(pasajeroItem));
      const pasajerosToAdd = pasajeros.filter(pasajeroItem => {
        const pasajeroIdentifier = this.getPasajeroIdentifier(pasajeroItem);
        if (pasajeroCollectionIdentifiers.includes(pasajeroIdentifier)) {
          return false;
        }
        pasajeroCollectionIdentifiers.push(pasajeroIdentifier);
        return true;
      });
      return [...pasajerosToAdd, ...pasajeroCollection];
    }
    return pasajeroCollection;
  }

  protected convertValueFromClient<T extends IPasajero | NewPasajero | PartialUpdatePasajero>(pasajero: T): RestOf<T> {
    return {
      ...pasajero,
      fechaNacimiento: pasajero.fechaNacimiento?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestPasajero): IPasajero {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestPasajero[]): IPasajero[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
