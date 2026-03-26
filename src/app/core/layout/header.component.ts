import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../auth/services/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { DefaultImagePipe } from '../../shared/pipes/default-image.pipe';

/**
 * Global navigation header displayed on every page.
 *
 * Renders different nav links based on authentication state:
 * - Unauthenticated: Home, Sign in, Sign up
 * - Authenticated: Home, New Article, Settings, Profile (with avatar)
 * - Unavailable: Shows a "Connecting..." indicator while the server is unreachable
 */
@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  imports: [RouterLinkActive, RouterLink, AsyncPipe, DefaultImagePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private userService = inject(UserService);
  /** Emits the current user or null when unauthenticated. */
  currentUser$ = this.userService.currentUser;
  /** Emits the current auth state ('loading' | 'authenticated' | 'unauthenticated' | 'unavailable'). */
  authState$ = this.userService.authState;
}
