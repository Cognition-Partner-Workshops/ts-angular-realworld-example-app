import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true,
})
/**
 * Converts markdown content to sanitized HTML for safe rendering.
 * Uses the `marked` library (lazy-loaded) and Angular's DomSanitizer
 * to prevent XSS. Used on the article detail page to render article bodies.
 */
export class MarkdownPipe implements PipeTransform {
  domSanitizer = inject(DomSanitizer);

  /** Parses markdown to HTML and sanitizes the output. Returns an empty string if sanitization strips everything. */
  async transform(content: string): Promise<string> {
    const { marked } = await import('marked');
    return this.domSanitizer.sanitize(SecurityContext.HTML, marked.parse(content)) || '';
  }
}
