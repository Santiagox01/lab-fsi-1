import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { VueloService } from '../service/vuelo.service';
import { IVuelo } from '../vuelo.model';

import { VueloFormService } from './vuelo-form.service';
import { VueloUpdate } from './vuelo-update';

describe('Vuelo Management Update Component', () => {
  let comp: VueloUpdate;
  let fixture: ComponentFixture<VueloUpdate>;
  let activatedRoute: ActivatedRoute;
  let vueloFormService: VueloFormService;
  let vueloService: VueloService;

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

    fixture = TestBed.createComponent(VueloUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vueloFormService = TestBed.inject(VueloFormService);
    vueloService = TestBed.inject(VueloService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const vuelo: IVuelo = { id: 26877 };

      activatedRoute.data = of({ vuelo });
      comp.ngOnInit();

      expect(comp.vuelo).toEqual(vuelo);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IVuelo>();
      const vuelo = { id: 469 };
      vi.spyOn(vueloFormService, 'getVuelo').mockReturnValue(vuelo);
      vi.spyOn(vueloService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vuelo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(vuelo);
      saveSubject.complete();

      // THEN
      expect(vueloFormService.getVuelo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vueloService.update).toHaveBeenCalledWith(expect.objectContaining(vuelo));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IVuelo>();
      const vuelo = { id: 469 };
      vi.spyOn(vueloFormService, 'getVuelo').mockReturnValue({ id: null });
      vi.spyOn(vueloService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vuelo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(vuelo);
      saveSubject.complete();

      // THEN
      expect(vueloFormService.getVuelo).toHaveBeenCalled();
      expect(vueloService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IVuelo>();
      const vuelo = { id: 469 };
      vi.spyOn(vueloService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vuelo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vueloService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
