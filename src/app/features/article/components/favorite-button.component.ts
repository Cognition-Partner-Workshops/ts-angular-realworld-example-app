import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
import { NgClass } from '@angular/common';
import { ArticlesService } from '../services/articles.service';
import { UserService } from '../../../core/auth/services/user.service';
import { Article } from '../models/article.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-favorite-button',
  template: `
    <button
      class="btn btn-sm"
      [ngClass]="{
        disabled: isSubmitting(),
        'btn-outline-primary': !article.favorited,
        'btn-primary': article.favorited,
      }"
      (click)="toggleFavorite()"
    >
      <i class="ion-heart"></i> <ng-content></ng-content>
    </button>
  `,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Heart button for favoriting/unfavoriting an article.
 * Redirects unauthenticated users to the registration page.
 * Emits the new favorited state on success so the parent can update optimistically.
 */
export class FavoriteButtonComponent {
  destroyRef = inject(DestroyRef);
  /** Prevents double-clicks while the API call is in flight. */
  isSubmitting = signal(false);

  @Input() article!: Article;
  /** Emits the new `favorited` boolean after a successful API call. */
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  /** Calls favorite or unfavorite depending on the article's current state. */
  toggleFavorite(): void {
    this.isSubmitting.set(true);

    this.userService.isAuthenticated
      .pipe(
        switchMap(authenticated => {
          if (!authenticated) {
            void this.router.navigate(['/register']);
            return EMPTY;
          }

          if (!this.article.favorited) {
            return this.articleService.favorite(this.article.slug);
          } else {
            return this.articleService.unfavorite(this.article.slug);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toggle.emit(!this.article.favorited);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
