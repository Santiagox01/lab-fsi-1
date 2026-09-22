import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-management',
    title: 'userManagement.home.title',
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  {
    path: 'authority',
    title: 'aerolineaVirtualApp.adminAuthority.home.title',
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'pasajero',
    title: 'aerolineaVirtualApp.pasajero.home.title',
    loadChildren: () => import('./pasajero/pasajero.routes'),
  },
  {
    path: 'reserva',
    title: 'aerolineaVirtualApp.reserva.home.title',
    loadChildren: () => import('./reserva/reserva.routes'),
  },
  {
    path: 'vuelo',
    title: 'aerolineaVirtualApp.vuelo.home.title',
    loadChildren: () => import('./vuelo/vuelo.routes'),
  },
  {
    path: 'asiento',
    title: 'aerolineaVirtualApp.asiento.home.title',
    loadChildren: () => import('./asiento/asiento.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
