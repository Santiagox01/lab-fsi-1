import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IReserva, NewReserva } from '../reserva.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReserva for edit and NewReservaFormGroupInput for create.
 */
type ReservaFormGroupInput = IReserva | PartialWithRequiredKeyOf<NewReserva>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReserva | NewReserva> = Omit<T, 'fechaReserva'> & {
  fechaReserva?: string | null;
};

type ReservaFormRawValue = FormValueOf<IReserva>;

type NewReservaFormRawValue = FormValueOf<NewReserva>;

type ReservaFormDefaults = Pick<NewReserva, 'id' | 'fechaReserva'>;

type ReservaFormGroupContent = {
  id: FormControl<ReservaFormRawValue['id'] | NewReserva['id']>;
  codigo: FormControl<ReservaFormRawValue['codigo']>;
  fechaReserva: FormControl<ReservaFormRawValue['fechaReserva']>;
  estado: FormControl<ReservaFormRawValue['estado']>;
  vuelo: FormControl<ReservaFormRawValue['vuelo']>;
  asiento: FormControl<ReservaFormRawValue['asiento']>;
  pasajero: FormControl<ReservaFormRawValue['pasajero']>;
};

export type ReservaFormGroup = FormGroup<ReservaFormGroupContent>;

@Service()
export class ReservaFormService {
  createReservaFormGroup(reserva?: ReservaFormGroupInput): ReservaFormGroup {
    const reservaRawValue = this.convertReservaToReservaRawValue({
      ...this.getFormDefaults(),
      ...(reserva ?? { id: null }),
    });

    return new FormGroup<ReservaFormGroupContent>({
      id: new FormControl(
        { value: reservaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigo: new FormControl(reservaRawValue.codigo, {
        validators: [Validators.required],
      }),
      fechaReserva: new FormControl(reservaRawValue.fechaReserva, {
        validators: [Validators.required],
      }),
      estado: new FormControl(reservaRawValue.estado, {
        validators: [Validators.required],
      }),
      vuelo: new FormControl(reservaRawValue.vuelo),
      asiento: new FormControl(reservaRawValue.asiento),
      pasajero: new FormControl(reservaRawValue.pasajero),
    });
  }

  getReserva(form: ReservaFormGroup): IReserva | NewReserva {
    return this.convertReservaRawValueToReserva(form.getRawValue());
  }

  resetForm(form: ReservaFormGroup, reserva: ReservaFormGroupInput): void {
    const reservaRawValue = this.convertReservaToReservaRawValue({ ...this.getFormDefaults(), ...reserva });
    form.reset({
      ...reservaRawValue,
      id: { value: reservaRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ReservaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaReserva: currentTime,
    };
  }

  private convertReservaRawValueToReserva(rawReserva: ReservaFormRawValue | NewReservaFormRawValue): IReserva | NewReserva {
    return {
      ...rawReserva,
      fechaReserva: dayjs(rawReserva.fechaReserva, DATE_TIME_FORMAT),
    };
  }

  private convertReservaToReservaRawValue(
    reserva: IReserva | (Partial<NewReserva> & ReservaFormDefaults),
  ): ReservaFormRawValue | PartialWithRequiredKeyOf<NewReservaFormRawValue> {
    return {
      ...reserva,
      fechaReserva: reserva.fechaReserva ? reserva.fechaReserva.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
