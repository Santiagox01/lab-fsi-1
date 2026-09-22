import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPasajero, NewPasajero } from '../pasajero.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPasajero for edit and NewPasajeroFormGroupInput for create.
 */
type PasajeroFormGroupInput = IPasajero | PartialWithRequiredKeyOf<NewPasajero>;

type PasajeroFormDefaults = Pick<NewPasajero, 'id'>;

type PasajeroFormGroupContent = {
  id: FormControl<IPasajero['id'] | NewPasajero['id']>;
  nombre: FormControl<IPasajero['nombre']>;
  apellido: FormControl<IPasajero['apellido']>;
  email: FormControl<IPasajero['email']>;
  telefono: FormControl<IPasajero['telefono']>;
  fechaNacimiento: FormControl<IPasajero['fechaNacimiento']>;
};

export type PasajeroFormGroup = FormGroup<PasajeroFormGroupContent>;

@Service()
export class PasajeroFormService {
  createPasajeroFormGroup(pasajero?: PasajeroFormGroupInput): PasajeroFormGroup {
    const pasajeroRawValue = {
      ...this.getFormDefaults(),
      ...(pasajero ?? { id: null }),
    };

    return new FormGroup<PasajeroFormGroupContent>({
      id: new FormControl(
        { value: pasajeroRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(pasajeroRawValue.nombre, {
        validators: [Validators.required],
      }),
      apellido: new FormControl(pasajeroRawValue.apellido, {
        validators: [Validators.required],
      }),
      email: new FormControl(pasajeroRawValue.email, {
        validators: [Validators.required],
      }),
      telefono: new FormControl(pasajeroRawValue.telefono),
      fechaNacimiento: new FormControl(pasajeroRawValue.fechaNacimiento),
    });
  }

  getPasajero(form: PasajeroFormGroup): IPasajero | NewPasajero {
    return form.getRawValue();
  }

  resetForm(form: PasajeroFormGroup, pasajero: PasajeroFormGroupInput): void {
    const pasajeroRawValue = { ...this.getFormDefaults(), ...pasajero };
    form.reset({
      ...pasajeroRawValue,
      id: { value: pasajeroRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PasajeroFormDefaults {
    return {
      id: null,
    };
  }
}
