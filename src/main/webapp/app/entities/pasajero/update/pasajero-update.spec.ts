import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IPasajero } from '../pasajero.model';
import { PasajeroService } from '../service/pasajero.service';

import { PasajeroFormService } from './pasajero-form.service';
import { PasajeroUpdate } from './pasajero-update';

describe('Pasajero Management Update Component', () => {
  let comp: PasajeroUpdate;
  let fixture: ComponentFixture<PasajeroUpdate>;
  let activatedRoute: ActivatedRoute;
  let pasajeroFormService: PasajeroFormService;
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

    fixture = TestBed.createComponent(PasajeroUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pasajeroFormService = TestBed.inject(PasajeroFormService);
    pasajeroService = TestBed.inject(PasajeroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const pasajero: IPasajero = { id: 13619 };

      activatedRoute.data = of({ pasajero });
      comp.ngOnInit();

      expect(comp.pasajero).toEqual(pasajero);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPasajero>();
      const pasajero = { id: 4758 };
      vi.spyOn(pasajeroFormService, 'getPasajero').mockReturnValue(pasajero);
      vi.spyOn(pasajeroService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pasajero });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(pasajero);
      saveSubject.complete();

      // THEN
      expect(pasajeroFormService.getPasajero).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pasajeroService.update).toHaveBeenCalledWith(expect.objectContaining(pasajero));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPasajero>();
      const pasajero = { id: 4758 };
      vi.spyOn(pasajeroFormService, 'getPasajero').mockReturnValue({ id: null });
      vi.spyOn(pasajeroService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pasajero: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(pasajero);
      saveSubject.complete();

      // THEN
      expect(pasajeroFormService.getPasajero).toHaveBeenCalled();
      expect(pasajeroService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPasajero>();
      const pasajero = { id: 4758 };
      vi.spyOn(pasajeroService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pasajero });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pasajeroService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
