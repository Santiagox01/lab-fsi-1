import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IPasajero } from '../pasajero.model';
import { PasajeroService } from '../service/pasajero.service';

const pasajeroResolve = (route: ActivatedRouteSnapshot): Observable<null | IPasajero> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(PasajeroService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default pasajeroResolve;
