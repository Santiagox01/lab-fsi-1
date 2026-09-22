import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize, map } from 'rxjs';

import { IAsiento } from 'app/entities/asiento/asiento.model';
import { AsientoService } from 'app/entities/asiento/service/asiento.service';
import { IPasajero } from 'app/entities/pasajero/pasajero.model';
import { PasajeroService } from 'app/entities/pasajero/service/pasajero.service';
import { VueloService } from 'app/entities/vuelo/service/vuelo.service';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

import { ReservaFormGroup, ReservaFormService } from './reserva-form.service';

@Component({
  selector: 'jhi-reserva-update',
  templateUrl: './reserva-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class ReservaUpdate implements OnInit {
  readonly isSaving = signal(false);
  reserva: IReserva | null = null;

  vuelosSharedCollection = signal<IVuelo[]>([]);
  asientosSharedCollection = signal<IAsiento[]>([]);
  pasajerosSharedCollection = signal<IPasajero[]>([]);

  protected reservaService = inject(ReservaService);
  protected reservaFormService = inject(ReservaFormService);
  protected vueloService = inject(VueloService);
  protected asientoService = inject(AsientoService);
  protected pasajeroService = inject(PasajeroService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReservaFormGroup = this.reservaFormService.createReservaFormGroup();

  compareVuelo = (o1: IVuelo | null, o2: IVuelo | null): boolean => this.vueloService.compareVuelo(o1, o2);

  compareAsiento = (o1: IAsiento | null, o2: IAsiento | null): boolean => this.asientoService.compareAsiento(o1, o2);

  comparePasajero = (o1: IPasajero | null, o2: IPasajero | null): boolean => this.pasajeroService.comparePasajero(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserva }) => {
      this.reserva = reserva;
      if (reserva) {
        this.updateForm(reserva);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const reserva = this.reservaFormService.getReserva(this.editForm);
    if (reserva.id === null) {
      this.subscribeToSaveResponse(this.reservaService.create(reserva));
    } else {
      this.subscribeToSaveResponse(this.reservaService.update(reserva));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IReserva | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(reserva: IReserva): void {
    this.reserva = reserva;
    this.reservaFormService.resetForm(this.editForm, reserva);

    this.vuelosSharedCollection.update(vuelos => this.vueloService.addVueloToCollectionIfMissing<IVuelo>(vuelos, reserva.vuelo));
    this.asientosSharedCollection.update(asientos =>
      this.asientoService.addAsientoToCollectionIfMissing<IAsiento>(asientos, reserva.asiento),
    );
    this.pasajerosSharedCollection.update(pasajeros =>
      this.pasajeroService.addPasajeroToCollectionIfMissing<IPasajero>(pasajeros, reserva.pasajero),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vueloService
      .query()
      .pipe(map((res: HttpResponse<IVuelo[]>) => res.body ?? []))
      .pipe(map((vuelos: IVuelo[]) => this.vueloService.addVueloToCollectionIfMissing<IVuelo>(vuelos, this.reserva?.vuelo)))
      .subscribe((vuelos: IVuelo[]) => this.vuelosSharedCollection.set(vuelos));

    this.asientoService
      .query()
      .pipe(map((res: HttpResponse<IAsiento[]>) => res.body ?? []))
      .pipe(map((asientos: IAsiento[]) => this.asientoService.addAsientoToCollectionIfMissing<IAsiento>(asientos, this.reserva?.asiento)))
      .subscribe((asientos: IAsiento[]) => this.asientosSharedCollection.set(asientos));

    this.pasajeroService
      .query()
      .pipe(map((res: HttpResponse<IPasajero[]>) => res.body ?? []))
      .pipe(
        map((pasajeros: IPasajero[]) =>
          this.pasajeroService.addPasajeroToCollectionIfMissing<IPasajero>(pasajeros, this.reserva?.pasajero),
        ),
      )
      .subscribe((pasajeros: IPasajero[]) => this.pasajerosSharedCollection.set(pasajeros));
  }
}
