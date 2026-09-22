import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vuelo.test-samples';

import { VueloFormService } from './vuelo-form.service';

describe('Vuelo Form Service', () => {
  let service: VueloFormService;

  beforeEach(() => {
    service = TestBed.inject(VueloFormService);
  });

  describe('Service methods', () => {
    describe('createVueloFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVueloFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroVuelo: expect.any(Object),
            origen: expect.any(Object),
            destino: expect.any(Object),
            fechaSalida: expect.any(Object),
            fechaLlegada: expect.any(Object),
          }),
        );
      });

      it('passing IVuelo should create a new form with FormGroup', () => {
        const formGroup = service.createVueloFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroVuelo: expect.any(Object),
            origen: expect.any(Object),
            destino: expect.any(Object),
            fechaSalida: expect.any(Object),
            fechaLlegada: expect.any(Object),
          }),
        );
      });
    });

    describe('getVuelo', () => {
      it('should return NewVuelo for default Vuelo initial value', () => {
        const formGroup = service.createVueloFormGroup(sampleWithNewData);

        const vuelo = service.getVuelo(formGroup);

        expect(vuelo).toMatchObject(sampleWithNewData);
      });

      it('should return NewVuelo for empty Vuelo initial value', () => {
        const formGroup = service.createVueloFormGroup();

        const vuelo = service.getVuelo(formGroup);

        expect(vuelo).toMatchObject({});
      });

      it('should return IVuelo', () => {
        const formGroup = service.createVueloFormGroup(sampleWithRequiredData);

        const vuelo = service.getVuelo(formGroup);

        expect(vuelo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVuelo should not enable id FormControl', () => {
        const formGroup = service.createVueloFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVuelo should disable id FormControl', () => {
        const formGroup = service.createVueloFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
