import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IVuelo, NewVuelo } from '../vuelo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVuelo for edit and NewVueloFormGroupInput for create.
 */
type VueloFormGroupInput = IVuelo | PartialWithRequiredKeyOf<NewVuelo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVuelo | NewVuelo> = Omit<T, 'fechaSalida' | 'fechaLlegada'> & {
  fechaSalida?: string | null;
  fechaLlegada?: string | null;
};

type VueloFormRawValue = FormValueOf<IVuelo>;

type NewVueloFormRawValue = FormValueOf<NewVuelo>;

type VueloFormDefaults = Pick<NewVuelo, 'id' | 'fechaSalida' | 'fechaLlegada'>;

type VueloFormGroupContent = {
  id: FormControl<VueloFormRawValue['id'] | NewVuelo['id']>;
  numeroVuelo: FormControl<VueloFormRawValue['numeroVuelo']>;
  origen: FormControl<VueloFormRawValue['origen']>;
  destino: FormControl<VueloFormRawValue['destino']>;
  fechaSalida: FormControl<VueloFormRawValue['fechaSalida']>;
  fechaLlegada: FormControl<VueloFormRawValue['fechaLlegada']>;
};

export type VueloFormGroup = FormGroup<VueloFormGroupContent>;

@Service()
export class VueloFormService {
  createVueloFormGroup(vuelo?: VueloFormGroupInput): VueloFormGroup {
    const vueloRawValue = this.convertVueloToVueloRawValue({
      ...this.getFormDefaults(),
      ...(vuelo ?? { id: null }),
    });

    return new FormGroup<VueloFormGroupContent>({
      id: new FormControl(
        { value: vueloRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numeroVuelo: new FormControl(vueloRawValue.numeroVuelo, {
        validators: [Validators.required],
      }),
      origen: new FormControl(vueloRawValue.origen, {
        validators: [Validators.required],
      }),
      destino: new FormControl(vueloRawValue.destino, {
        validators: [Validators.required],
      }),
      fechaSalida: new FormControl(vueloRawValue.fechaSalida, {
        validators: [Validators.required],
      }),
      fechaLlegada: new FormControl(vueloRawValue.fechaLlegada, {
        validators: [Validators.required],
      }),
    });
  }

  getVuelo(form: VueloFormGroup): IVuelo | NewVuelo {
    return this.convertVueloRawValueToVuelo(form.getRawValue());
  }

  resetForm(form: VueloFormGroup, vuelo: VueloFormGroupInput): void {
    const vueloRawValue = this.convertVueloToVueloRawValue({ ...this.getFormDefaults(), ...vuelo });
    form.reset({
      ...vueloRawValue,
      id: { value: vueloRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): VueloFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaSalida: currentTime,
      fechaLlegada: currentTime,
    };
  }

  private convertVueloRawValueToVuelo(rawVuelo: VueloFormRawValue | NewVueloFormRawValue): IVuelo | NewVuelo {
    return {
      ...rawVuelo,
      fechaSalida: dayjs(rawVuelo.fechaSalida, DATE_TIME_FORMAT),
      fechaLlegada: dayjs(rawVuelo.fechaLlegada, DATE_TIME_FORMAT),
    };
  }

  private convertVueloToVueloRawValue(
    vuelo: IVuelo | (Partial<NewVuelo> & VueloFormDefaults),
  ): VueloFormRawValue | PartialWithRequiredKeyOf<NewVueloFormRawValue> {
    return {
      ...vuelo,
      fechaSalida: vuelo.fechaSalida ? vuelo.fechaSalida.format(DATE_TIME_FORMAT) : undefined,
      fechaLlegada: vuelo.fechaLlegada ? vuelo.fechaLlegada.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
