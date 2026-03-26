import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Errors } from '../../core/models/errors.model';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Renders API validation errors as a styled list.
 *
 * Converts the `{ errors: { field: message } }` response shape into
 * human-readable strings like "email has already been taken".
 * Used in login, register, settings, and editor forms.
 */
export class ListErrorsComponent {
  /** Flat list of formatted error strings for template rendering. */
  errorList: string[] = [];

  /** Accepts an {@link Errors} object and flattens it into `errorList`. */
  @Input() set errors(errorList: Errors | null) {
    this.errorList = errorList ? Object.keys(errorList.errors || {}).map(key => `${key} ${errorList.errors[key]}`) : [];
  }
}
