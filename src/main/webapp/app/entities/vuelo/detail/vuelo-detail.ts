import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IVuelo } from '../vuelo.model';

@Component({
  selector: 'jhi-vuelo-detail',
  templateUrl: './vuelo-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe],
})
export class VueloDetail {
  readonly vuelo = input<IVuelo | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
