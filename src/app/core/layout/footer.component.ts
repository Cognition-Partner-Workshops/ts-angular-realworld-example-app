import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Site-wide footer with branding and the current year. */
@Component({
  selector: 'app-layout-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink],
})
export class FooterComponent {
  /** Timestamp used by the DatePipe to display the current year. */
  today: number = Date.now();
}
