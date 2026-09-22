import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IPasajero } from '../pasajero.model';
import { PasajeroService } from '../service/pasajero.service';

import { PasajeroFormGroup, PasajeroFormService } from './pasajero-form.service';

@Component({
  selector: 'jhi-pasajero-update',
  templateUrl: './pasajero-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class PasajeroUpdate implements OnInit {
  readonly isSaving = signal(false);
  pasajero: IPasajero | null = null;

  protected pasajeroService = inject(PasajeroService);
  protected pasajeroFormService = inject(PasajeroFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PasajeroFormGroup = this.pasajeroFormService.createPasajeroFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pasajero }) => {
      this.pasajero = pasajero;
      if (pasajero) {
        this.updateForm(pasajero);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const pasajero = this.pasajeroFormService.getPasajero(this.editForm);
    if (pasajero.id === null) {
      this.subscribeToSaveResponse(this.pasajeroService.create(pasajero));
    } else {
      this.subscribeToSaveResponse(this.pasajeroService.update(pasajero));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPasajero | null>): void {
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

  protected updateForm(pasajero: IPasajero): void {
    this.pasajero = pasajero;
    this.pasajeroFormService.resetForm(this.editForm, pasajero);
  }
}
