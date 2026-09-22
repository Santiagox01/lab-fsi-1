import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import AsientoResolve from './route/asiento-routing-resolve.service';

const asientoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/asiento').then(m => m.Asiento),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/asiento-detail').then(m => m.AsientoDetail),
    resolve: {
      asiento: AsientoResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/asiento-update').then(m => m.AsientoUpdate),
    resolve: {
      asiento: AsientoResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/asiento-update').then(m => m.AsientoUpdate),
    resolve: {
      asiento: AsientoResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default asientoRoute;
