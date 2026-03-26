import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Errors } from '../../../../core/models/errors.model';
import { ArticlesService } from '../../services/articles.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { ListErrorsComponent } from '../../../../shared/components/list-errors.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Reactive form shape for the article editor. Tags are managed separately via a signal. */
interface ArticleForm {
  title: FormControl<string>;
  description: FormControl<string>;
  body: FormControl<string>;
}

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html',
  imports: [ListErrorsComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Create/edit article page.
 *
 * In edit mode (route has :slug), loads the existing article and verifies
 * the current user is the author before allowing edits.
 * In create mode, starts with an empty form.
 */
export default class EditorComponent implements OnInit {
  /** Tags attached to the article, managed outside the form group. */
  tagList = signal<string[]>([]);
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    body: new FormControl('', { nonNullable: true }),
  });
  /** Input field for adding new tags one at a time. */
  tagField = new FormControl<string>('', { nonNullable: true });

  errors = signal<Errors | null>(null);
  isSubmitting = signal(false);
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params['slug']) {
      combineLatest([this.articleService.get(this.route.snapshot.params['slug']), this.userService.getCurrentUser()])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([article, { user }]) => {
          if (user.username === article.author.username) {
            this.tagList.set(article.tagList);
            this.articleForm.patchValue(article);
          } else {
            void this.router.navigate(['/']);
          }
        });
    }
  }

  /** Appends the current tag field value to the tag list if it is non-empty and unique. */
  addTag() {
    // retrieve tag control
    const tag = this.tagField.value;
    // only add tag if it does not exist yet
    if (tag != null && tag.trim() !== '' && this.tagList().indexOf(tag) < 0) {
      this.tagList.update(tags => [...tags, tag]);
    }
    // clear the input
    this.tagField.reset('');
  }

  /** Removes a tag from the article by name. */
  removeTag(tagName: string): void {
    this.tagList.update(tags => tags.filter(tag => tag !== tagName));
  }

  /** Creates or updates the article and navigates to its detail page on success. */
  submitForm(): void {
    this.isSubmitting.set(true);
    // update any single tag
    this.addTag();

    const slug = this.route.snapshot.params['slug'];
    const articleData = {
      ...this.articleForm.value,
      tagList: this.tagList(),
    };

    const observable = slug
      ? this.articleService.update({ ...articleData, slug })
      : this.articleService.create(articleData);

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: article => this.router.navigate(['/article/', article.slug]),
      error: err => {
        this.errors.set(err);
        this.isSubmitting.set(false);
      },
    });
  }
}
