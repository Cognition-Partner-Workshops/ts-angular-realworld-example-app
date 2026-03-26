import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleListComponent } from '../../article/components/article-list.component';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../models/profile.model';
import { ArticleListConfig } from '../../article/models/article-list-config.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-favorites',
  template: `@if (favoritesConfig()) {
    <app-article-list [limit]="10" [config]="favoritesConfig()!" />
  }`,
  imports: [ArticleListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Displays articles favorited by the profile user.
 * Loaded as a child route of {@link ProfileComponent} at `/profile/:username/favorites`.
 */
export default class ProfileFavoritesComponent implements OnInit {
  profile = signal<Profile | null>(null);
  favoritesConfig = signal<ArticleListConfig | null>(null);
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService,
  ) {}

  /** Fetches the profile and configures an article list filtered by favorited username. */
  ngOnInit() {
    this.profileService
      .get(this.route.parent?.snapshot.params['username'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: Profile) => {
          this.profile.set(profile);
          this.favoritesConfig.set({
            type: 'all',
            filters: {
              favorited: profile.username,
            },
          });
        },
      });
  }
}
