import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import VueloResolve from './route/vuelo-routing-resolve.service';

const vueloRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vuelo').then(m => m.Vuelo),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/vuelo-detail').then(m => m.VueloDetail),
    resolve: {
      vuelo: VueloResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vuelo-update').then(m => m.VueloUpdate),
    resolve: {
      vuelo: VueloResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/vuelo-update').then(m => m.VueloUpdate),
    resolve: {
      vuelo: VueloResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default vueloRoute;
