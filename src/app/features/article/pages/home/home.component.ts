import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TagsService } from '../../services/tags.service';
import { ArticleListConfig } from '../../models/article-list-config.model';
import { NgClass } from '@angular/common';
import { ArticleListComponent } from '../../components/article-list.component';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../../../core/auth/services/user.service';
import { RxLet } from '@rx-angular/template/let';
import { IfAuthenticatedDirective } from '../../../../core/auth/if-authenticated.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgClass, ArticleListComponent, RxLet, IfAuthenticatedDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Landing page with feed navigation (Global Feed, Your Feed, Tag Feed),
 * a paginated article list, and a sidebar of popular tags.
 *
 * Reacts to route params and query params:
 * - `/` — Global feed
 * - `/tag/:tag` — Articles filtered by tag
 * - `/?feed=following` — Following feed (requires auth)
 * - `/?page=N` — Pagination
 */
export default class HomeComponent implements OnInit {
  isAuthenticated = signal(false);
  /** Current article list query configuration, rebuilt on every route change. */
  listConfig = signal<ArticleListConfig>({
    type: 'all',
    filters: {},
  });
  currentPage = signal(1);
  /** Observable of all popular tags, loaded once for the sidebar. */
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => this.tagsLoaded.set(true)));
  tagsLoaded = signal(false);
  /** True when viewing the "Your Feed" tab; used for empty-state messaging. */
  isFollowingFeed = signal(false);
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.userService.isAuthenticated, this.route.params, this.route.queryParams])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([isAuthenticated, params, queryParams]) => {
        this.isAuthenticated.set(isAuthenticated);

        const tag = params['tag'];
        const feed = queryParams['feed'];
        const page = queryParams['page'] ? parseInt(queryParams['page'], 10) : 1;

        // If feed=following but not authenticated, redirect to login
        if (feed === 'following' && !isAuthenticated) {
          void this.router.navigate(['/login']);
          return;
        }

        let type: string;
        let filters: { tag?: string } = {};

        if (tag) {
          type = 'all';
          filters = { tag };
        } else if (feed === 'following') {
          type = 'feed';
        } else {
          type = 'all';
        }

        this.currentPage.set(page);
        this.listConfig.set({ type, filters });
        this.isFollowingFeed.set(type === 'feed');
      });
  }

  /** Updates the URL query params when the user clicks a pagination button. */
  onPageChange(page: number): void {
    const queryParams: { page?: number; feed?: string } = {};

    // Preserve feed param if present
    const currentFeed = this.route.snapshot.queryParams['feed'];
    if (currentFeed) {
      queryParams.feed = currentFeed;
    }

    // Only add page param if not page 1
    if (page > 1) {
      queryParams.page = page;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }
}
