import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAsiento } from '../asiento.model';
import { AsientoService } from '../service/asiento.service';

import { AsientoFormService } from './asiento-form.service';
import { AsientoUpdate } from './asiento-update';

describe('Asiento Management Update Component', () => {
  let comp: AsientoUpdate;
  let fixture: ComponentFixture<AsientoUpdate>;
  let activatedRoute: ActivatedRoute;
  let asientoFormService: AsientoFormService;
  let asientoService: AsientoService;

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

    fixture = TestBed.createComponent(AsientoUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    asientoFormService = TestBed.inject(AsientoFormService);
    asientoService = TestBed.inject(AsientoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const asiento: IAsiento = { id: 27821 };

      activatedRoute.data = of({ asiento });
      comp.ngOnInit();

      expect(comp.asiento).toEqual(asiento);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAsiento>();
      const asiento = { id: 20063 };
      vi.spyOn(asientoFormService, 'getAsiento').mockReturnValue(asiento);
      vi.spyOn(asientoService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asiento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(asiento);
      saveSubject.complete();

      // THEN
      expect(asientoFormService.getAsiento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(asientoService.update).toHaveBeenCalledWith(expect.objectContaining(asiento));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAsiento>();
      const asiento = { id: 20063 };
      vi.spyOn(asientoFormService, 'getAsiento').mockReturnValue({ id: null });
      vi.spyOn(asientoService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asiento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(asiento);
      saveSubject.complete();

      // THEN
      expect(asientoFormService.getAsiento).toHaveBeenCalled();
      expect(asientoService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAsiento>();
      const asiento = { id: 20063 };
      vi.spyOn(asientoService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asiento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(asientoService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
