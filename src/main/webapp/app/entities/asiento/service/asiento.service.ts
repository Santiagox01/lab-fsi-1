import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IAsiento, NewAsiento } from '../asiento.model';

export type PartialUpdateAsiento = Partial<IAsiento> & Pick<IAsiento, 'id'>;

@Service()
export class AsientosService {
  readonly asientosParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly asientosResource = httpResource<IAsiento[]>(() => {
    const params = this.asientosParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of asiento that have been fetched. It is updated when the asientosResource emits a new value.
   * In case of error while fetching the asientos, the signal is set to an empty array.
   */
  readonly asientos = computed(() => (this.asientosResource.hasValue() ? this.asientosResource.value() : []));
  protected readonly resourceUrl = `${serverApiUrl}api/asientos`;
}

@Service()
export class AsientoService extends AsientosService {
  protected readonly http = inject(HttpClient);

  create(asiento: NewAsiento): Observable<IAsiento> {
    return this.http.post<IAsiento>(this.resourceUrl, asiento);
  }

  update(asiento: IAsiento): Observable<IAsiento> {
    return this.http.put<IAsiento>(`${this.resourceUrl}/${encodeURIComponent(this.getAsientoIdentifier(asiento))}`, asiento);
  }

  partialUpdate(asiento: PartialUpdateAsiento): Observable<IAsiento> {
    return this.http.patch<IAsiento>(`${this.resourceUrl}/${encodeURIComponent(this.getAsientoIdentifier(asiento))}`, asiento);
  }

  find(id: number): Observable<IAsiento> {
    return this.http.get<IAsiento>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IAsiento[]>> {
    const options = createRequestOption(req);
    return this.http.get<IAsiento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getAsientoIdentifier(asiento: Pick<IAsiento, 'id'>): number {
    return asiento.id;
  }

  compareAsiento(o1: Pick<IAsiento, 'id'> | null, o2: Pick<IAsiento, 'id'> | null): boolean {
    return o1 && o2 ? this.getAsientoIdentifier(o1) === this.getAsientoIdentifier(o2) : o1 === o2;
  }

  addAsientoToCollectionIfMissing<Type extends Pick<IAsiento, 'id'>>(
    asientoCollection: Type[],
    ...asientosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const asientos: Type[] = asientosToCheck.filter(asientoItem => asientoItem !== null && asientoItem !== undefined);
    if (asientos.length > 0) {
      const asientoCollectionIdentifiers = asientoCollection.map(asientoItem => this.getAsientoIdentifier(asientoItem));
      const asientosToAdd = asientos.filter(asientoItem => {
        const asientoIdentifier = this.getAsientoIdentifier(asientoItem);
        if (asientoCollectionIdentifiers.includes(asientoIdentifier)) {
          return false;
        }
        asientoCollectionIdentifiers.push(asientoIdentifier);
        return true;
      });
      return [...asientosToAdd, ...asientoCollection];
    }
    return asientoCollection;
  }
}
