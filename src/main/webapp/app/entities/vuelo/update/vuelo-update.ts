import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { VueloService } from '../service/vuelo.service';
import { IVuelo } from '../vuelo.model';

import { VueloFormGroup, VueloFormService } from './vuelo-form.service';

@Component({
  selector: 'jhi-vuelo-update',
  templateUrl: './vuelo-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class VueloUpdate implements OnInit {
  readonly isSaving = signal(false);
  vuelo: IVuelo | null = null;

  protected vueloService = inject(VueloService);
  protected vueloFormService = inject(VueloFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VueloFormGroup = this.vueloFormService.createVueloFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vuelo }) => {
      this.vuelo = vuelo;
      if (vuelo) {
        this.updateForm(vuelo);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const vuelo = this.vueloFormService.getVuelo(this.editForm);
    if (vuelo.id === null) {
      this.subscribeToSaveResponse(this.vueloService.create(vuelo));
    } else {
      this.subscribeToSaveResponse(this.vueloService.update(vuelo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IVuelo | null>): void {
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

  protected updateForm(vuelo: IVuelo): void {
    this.vuelo = vuelo;
    this.vueloFormService.resetForm(this.editForm, vuelo);
  }
}
