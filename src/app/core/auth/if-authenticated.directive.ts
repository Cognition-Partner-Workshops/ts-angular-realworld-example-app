import { DestroyRef, Directive, inject, Input, OnInit, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from './services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Structural directive that conditionally renders content based on authentication state.
 *
 * Usage:
 * - `*ifAuthenticated="true"` — renders only when the user is logged in
 * - `*ifAuthenticated="false"` — renders only when the user is logged out
 *
 * Reacts to auth state changes in real time via {@link UserService.isAuthenticated}.
 */
@Directive({
  selector: '[ifAuthenticated]',
  standalone: true,
})
export class IfAuthenticatedDirective<T> implements OnInit {
  destroyRef = inject(DestroyRef);
  constructor(
    private templateRef: TemplateRef<T>,
    private userService: UserService,
    private viewContainer: ViewContainerRef,
  ) {}

  /** Whether the directive should show content for authenticated (true) or unauthenticated (false) users. */
  condition = signal(false);
  /** Tracks whether the template is currently inserted into the DOM. */
  hasView = signal(false);

  ngOnInit() {
    this.userService.isAuthenticated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isAuthenticated: boolean) => {
      const authRequired = isAuthenticated && this.condition();
      const unauthRequired = !isAuthenticated && !this.condition();

      if ((authRequired || unauthRequired) && !this.hasView()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView.set(true);
      } else if (this.hasView()) {
        this.viewContainer.clear();
        this.hasView.set(false);
      }
    });
  }

  @Input() set ifAuthenticated(condition: boolean) {
    this.condition.set(condition);
  }
}
