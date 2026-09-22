import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../pasajero.test-samples';

import { PasajeroFormService } from './pasajero-form.service';

describe('Pasajero Form Service', () => {
  let service: PasajeroFormService;

  beforeEach(() => {
    service = TestBed.inject(PasajeroFormService);
  });

  describe('Service methods', () => {
    describe('createPasajeroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPasajeroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            apellido: expect.any(Object),
            email: expect.any(Object),
            telefono: expect.any(Object),
            fechaNacimiento: expect.any(Object),
          }),
        );
      });

      it('passing IPasajero should create a new form with FormGroup', () => {
        const formGroup = service.createPasajeroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            apellido: expect.any(Object),
            email: expect.any(Object),
            telefono: expect.any(Object),
            fechaNacimiento: expect.any(Object),
          }),
        );
      });
    });

    describe('getPasajero', () => {
      it('should return NewPasajero for default Pasajero initial value', () => {
        const formGroup = service.createPasajeroFormGroup(sampleWithNewData);

        const pasajero = service.getPasajero(formGroup);

        expect(pasajero).toMatchObject(sampleWithNewData);
      });

      it('should return NewPasajero for empty Pasajero initial value', () => {
        const formGroup = service.createPasajeroFormGroup();

        const pasajero = service.getPasajero(formGroup);

        expect(pasajero).toMatchObject({});
      });

      it('should return IPasajero', () => {
        const formGroup = service.createPasajeroFormGroup(sampleWithRequiredData);

        const pasajero = service.getPasajero(formGroup);

        expect(pasajero).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPasajero should not enable id FormControl', () => {
        const formGroup = service.createPasajeroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPasajero should disable id FormControl', () => {
        const formGroup = service.createPasajeroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
