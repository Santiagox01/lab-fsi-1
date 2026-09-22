import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IVuelo, NewVuelo } from '../vuelo.model';

export type PartialUpdateVuelo = Partial<IVuelo> & Pick<IVuelo, 'id'>;

type RestOf<T extends IVuelo | NewVuelo> = Omit<T, 'fechaSalida' | 'fechaLlegada'> & {
  fechaSalida?: string | null;
  fechaLlegada?: string | null;
};

export type RestVuelo = RestOf<IVuelo>;

export type NewRestVuelo = RestOf<NewVuelo>;

export type PartialUpdateRestVuelo = RestOf<PartialUpdateVuelo>;

@Service()
export class VuelosService {
  readonly vuelosParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly vuelosResource = httpResource<RestVuelo[]>(() => {
    const params = this.vuelosParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of vuelo that have been fetched. It is updated when the vuelosResource emits a new value.
   * In case of error while fetching the vuelos, the signal is set to an empty array.
   */
  readonly vuelos = computed(() =>
    (this.vuelosResource.hasValue() ? this.vuelosResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/vuelos`;

  protected convertValueFromServer(restVuelo: RestVuelo): IVuelo {
    return {
      ...restVuelo,
      fechaSalida: restVuelo.fechaSalida ? dayjs(restVuelo.fechaSalida) : undefined,
      fechaLlegada: restVuelo.fechaLlegada ? dayjs(restVuelo.fechaLlegada) : undefined,
    };
  }
}

@Service()
export class VueloService extends VuelosService {
  protected readonly http = inject(HttpClient);

  create(vuelo: NewVuelo): Observable<IVuelo> {
    const copy = this.convertValueFromClient(vuelo);
    return this.http.post<RestVuelo>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vuelo: IVuelo): Observable<IVuelo> {
    const copy = this.convertValueFromClient(vuelo);
    return this.http
      .put<RestVuelo>(`${this.resourceUrl}/${encodeURIComponent(this.getVueloIdentifier(vuelo))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vuelo: PartialUpdateVuelo): Observable<IVuelo> {
    const copy = this.convertValueFromClient(vuelo);
    return this.http
      .patch<RestVuelo>(`${this.resourceUrl}/${encodeURIComponent(this.getVueloIdentifier(vuelo))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IVuelo> {
    return this.http.get<RestVuelo>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IVuelo[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVuelo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getVueloIdentifier(vuelo: Pick<IVuelo, 'id'>): number {
    return vuelo.id;
  }

  compareVuelo(o1: Pick<IVuelo, 'id'> | null, o2: Pick<IVuelo, 'id'> | null): boolean {
    return o1 && o2 ? this.getVueloIdentifier(o1) === this.getVueloIdentifier(o2) : o1 === o2;
  }

  addVueloToCollectionIfMissing<Type extends Pick<IVuelo, 'id'>>(
    vueloCollection: Type[],
    ...vuelosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vuelos: Type[] = vuelosToCheck.filter(vueloItem => vueloItem !== null && vueloItem !== undefined);
    if (vuelos.length > 0) {
      const vueloCollectionIdentifiers = vueloCollection.map(vueloItem => this.getVueloIdentifier(vueloItem));
      const vuelosToAdd = vuelos.filter(vueloItem => {
        const vueloIdentifier = this.getVueloIdentifier(vueloItem);
        if (vueloCollectionIdentifiers.includes(vueloIdentifier)) {
          return false;
        }
        vueloCollectionIdentifiers.push(vueloIdentifier);
        return true;
      });
      return [...vuelosToAdd, ...vueloCollection];
    }
    return vueloCollection;
  }

  protected convertValueFromClient<T extends IVuelo | NewVuelo | PartialUpdateVuelo>(vuelo: T): RestOf<T> {
    return {
      ...vuelo,
      fechaSalida: vuelo.fechaSalida?.toJSON() ?? null,
      fechaLlegada: vuelo.fechaLlegada?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestVuelo): IVuelo {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestVuelo[]): IVuelo[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
