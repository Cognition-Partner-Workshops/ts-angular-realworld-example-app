import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './core/layout/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layout/footer.component';

/**
 * Root application component.
 * Provides the shell layout: header, routed content area, and footer.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
