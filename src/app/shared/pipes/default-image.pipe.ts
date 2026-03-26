import { Pipe, PipeTransform } from '@angular/core';

/**
 * Provides a fallback avatar image when the user's image URL is null or empty.
 * Used throughout the app in author avatars and profile pages.
 */
@Pipe({ name: 'defaultImage', standalone: true })
export class DefaultImagePipe implements PipeTransform {
  /** Returns the given image URL, or a default SVG avatar if the value is falsy. */
  transform(image: string | null | undefined): string {
    return image || '/assets/images/default-avatar.svg';
  }
}
