import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IAsiento } from '../asiento.model';

@Component({
  selector: 'jhi-asiento-detail',
  templateUrl: './asiento-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class AsientoDetail {
  readonly asiento = input<IAsiento | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
