import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IAsiento } from '../asiento.model';
import { AsientoService } from '../service/asiento.service';

import { AsientoFormGroup, AsientoFormService } from './asiento-form.service';

@Component({
  selector: 'jhi-asiento-update',
  templateUrl: './asiento-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class AsientoUpdate implements OnInit {
  readonly isSaving = signal(false);
  asiento: IAsiento | null = null;

  protected asientoService = inject(AsientoService);
  protected asientoFormService = inject(AsientoFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AsientoFormGroup = this.asientoFormService.createAsientoFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asiento }) => {
      this.asiento = asiento;
      if (asiento) {
        this.updateForm(asiento);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const asiento = this.asientoFormService.getAsiento(this.editForm);
    if (asiento.id === null) {
      this.subscribeToSaveResponse(this.asientoService.create(asiento));
    } else {
      this.subscribeToSaveResponse(this.asientoService.update(asiento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAsiento | null>): void {
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

  protected updateForm(asiento: IAsiento): void {
    this.asiento = asiento;
    this.asientoFormService.resetForm(this.editForm, asiento);
  }
}
