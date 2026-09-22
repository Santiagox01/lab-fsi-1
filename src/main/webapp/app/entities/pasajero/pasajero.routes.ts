import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import PasajeroResolve from './route/pasajero-routing-resolve.service';

const pasajeroRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pasajero').then(m => m.Pasajero),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pasajero-detail').then(m => m.PasajeroDetail),
    resolve: {
      pasajero: PasajeroResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pasajero-update').then(m => m.PasajeroUpdate),
    resolve: {
      pasajero: PasajeroResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pasajero-update').then(m => m.PasajeroUpdate),
    resolve: {
      pasajero: PasajeroResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default pasajeroRoute;
