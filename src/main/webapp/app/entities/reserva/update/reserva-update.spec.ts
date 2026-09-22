import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAsiento } from 'app/entities/asiento/asiento.model';
import { AsientoService } from 'app/entities/asiento/service/asiento.service';
import { IPasajero } from 'app/entities/pasajero/pasajero.model';
import { PasajeroService } from 'app/entities/pasajero/service/pasajero.service';
import { VueloService } from 'app/entities/vuelo/service/vuelo.service';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';
import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

import { ReservaFormService } from './reserva-form.service';
import { ReservaUpdate } from './reserva-update';

describe('Reserva Management Update Component', () => {
  let comp: ReservaUpdate;
  let fixture: ComponentFixture<ReservaUpdate>;
  let activatedRoute: ActivatedRoute;
  let reservaFormService: ReservaFormService;
  let reservaService: ReservaService;
  let vueloService: VueloService;
  let asientoService: AsientoService;
  let pasajeroService: PasajeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ReservaUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservaFormService = TestBed.inject(ReservaFormService);
    reservaService = TestBed.inject(ReservaService);
    vueloService = TestBed.inject(VueloService);
    asientoService = TestBed.inject(AsientoService);
    pasajeroService = TestBed.inject(PasajeroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Vuelo query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const vuelo: IVuelo = { id: 469 };
      reserva.vuelo = vuelo;

      const vueloCollection: IVuelo[] = [{ id: 469 }];
      vi.spyOn(vueloService, 'query').mockReturnValue(of(new HttpResponse({ body: vueloCollection })));
      const additionalVuelos = [vuelo];
      const expectedCollection: IVuelo[] = [...additionalVuelos, ...vueloCollection];
      vi.spyOn(vueloService, 'addVueloToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(vueloService.query).toHaveBeenCalled();
      expect(vueloService.addVueloToCollectionIfMissing).toHaveBeenCalledWith(
        vueloCollection,
        ...additionalVuelos.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.vuelosSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Asiento query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const asiento: IAsiento = { id: 20063 };
      reserva.asiento = asiento;

      const asientoCollection: IAsiento[] = [{ id: 20063 }];
      vi.spyOn(asientoService, 'query').mockReturnValue(of(new HttpResponse({ body: asientoCollection })));
      const additionalAsientos = [asiento];
      const expectedCollection: IAsiento[] = [...additionalAsientos, ...asientoCollection];
      vi.spyOn(asientoService, 'addAsientoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(asientoService.query).toHaveBeenCalled();
      expect(asientoService.addAsientoToCollectionIfMissing).toHaveBeenCalledWith(
        asientoCollection,
        ...additionalAsientos.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.asientosSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Pasajero query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const pasajero: IPasajero = { id: 4758 };
      reserva.pasajero = pasajero;

      const pasajeroCollection: IPasajero[] = [{ id: 4758 }];
      vi.spyOn(pasajeroService, 'query').mockReturnValue(of(new HttpResponse({ body: pasajeroCollection })));
      const additionalPasajeros = [pasajero];
      const expectedCollection: IPasajero[] = [...additionalPasajeros, ...pasajeroCollection];
      vi.spyOn(pasajeroService, 'addPasajeroToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(pasajeroService.query).toHaveBeenCalled();
      expect(pasajeroService.addPasajeroToCollectionIfMissing).toHaveBeenCalledWith(
        pasajeroCollection,
        ...additionalPasajeros.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.pasajerosSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const reserva: IReserva = { id: 8835 };
      const vuelo: IVuelo = { id: 469 };
      reserva.vuelo = vuelo;
      const asiento: IAsiento = { id: 20063 };
      reserva.asiento = asiento;
      const pasajero: IPasajero = { id: 4758 };
      reserva.pasajero = pasajero;

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(comp.vuelosSharedCollection()).toContainEqual(vuelo);
      expect(comp.asientosSharedCollection()).toContainEqual(asiento);
      expect(comp.pasajerosSharedCollection()).toContainEqual(pasajero);
      expect(comp.reserva).toEqual(reserva);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IReserva>();
      const reserva = { id: 15097 };
      vi.spyOn(reservaFormService, 'getReserva').mockReturnValue(reserva);
      vi.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(reserva);
      saveSubject.complete();

      // THEN
      expect(reservaFormService.getReserva).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservaService.update).toHaveBeenCalledWith(expect.objectContaining(reserva));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IReserva>();
      const reserva = { id: 15097 };
      vi.spyOn(reservaFormService, 'getReserva').mockReturnValue({ id: null });
      vi.spyOn(reservaService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(reserva);
      saveSubject.complete();

      // THEN
      expect(reservaFormService.getReserva).toHaveBeenCalled();
      expect(reservaService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IReserva>();
      const reserva = { id: 15097 };
      vi.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservaService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVuelo', () => {
      it('should forward to vueloService', () => {
        const entity = { id: 469 };
        const entity2 = { id: 26877 };
        vi.spyOn(vueloService, 'compareVuelo');
        comp.compareVuelo(entity, entity2);
        expect(vueloService.compareVuelo).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAsiento', () => {
      it('should forward to asientoService', () => {
        const entity = { id: 20063 };
        const entity2 = { id: 27821 };
        vi.spyOn(asientoService, 'compareAsiento');
        comp.compareAsiento(entity, entity2);
        expect(asientoService.compareAsiento).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePasajero', () => {
      it('should forward to pasajeroService', () => {
        const entity = { id: 4758 };
        const entity2 = { id: 13619 };
        vi.spyOn(pasajeroService, 'comparePasajero');
        comp.comparePasajero(entity, entity2);
        expect(pasajeroService.comparePasajero).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
