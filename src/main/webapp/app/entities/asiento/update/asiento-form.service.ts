import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAsiento, NewAsiento } from '../asiento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAsiento for edit and NewAsientoFormGroupInput for create.
 */
type AsientoFormGroupInput = IAsiento | PartialWithRequiredKeyOf<NewAsiento>;

type AsientoFormDefaults = Pick<NewAsiento, 'id' | 'disponible'>;

type AsientoFormGroupContent = {
  id: FormControl<IAsiento['id'] | NewAsiento['id']>;
  numero: FormControl<IAsiento['numero']>;
  clase: FormControl<IAsiento['clase']>;
  disponible: FormControl<IAsiento['disponible']>;
};

export type AsientoFormGroup = FormGroup<AsientoFormGroupContent>;

@Service()
export class AsientoFormService {
  createAsientoFormGroup(asiento?: AsientoFormGroupInput): AsientoFormGroup {
    const asientoRawValue = {
      ...this.getFormDefaults(),
      ...(asiento ?? { id: null }),
    };

    return new FormGroup<AsientoFormGroupContent>({
      id: new FormControl(
        { value: asientoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numero: new FormControl(asientoRawValue.numero, {
        validators: [Validators.required],
      }),
      clase: new FormControl(asientoRawValue.clase, {
        validators: [Validators.required],
      }),
      disponible: new FormControl(asientoRawValue.disponible, {
        validators: [Validators.required],
      }),
    });
  }

  getAsiento(form: AsientoFormGroup): IAsiento | NewAsiento {
    return form.getRawValue();
  }

  resetForm(form: AsientoFormGroup, asiento: AsientoFormGroupInput): void {
    const asientoRawValue = { ...this.getFormDefaults(), ...asiento };
    form.reset({
      ...asientoRawValue,
      id: { value: asientoRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AsientoFormDefaults {
    return {
      id: null,
      disponible: false,
    };
  }
}
