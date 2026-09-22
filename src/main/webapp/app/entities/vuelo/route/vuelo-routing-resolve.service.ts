import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { VueloService } from '../service/vuelo.service';
import { IVuelo } from '../vuelo.model';

const vueloResolve = (route: ActivatedRouteSnapshot): Observable<null | IVuelo> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(VueloService);
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

export default vueloResolve;
