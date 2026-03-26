import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

/** Fetches the list of popular tags displayed in the home page sidebar. */
@Injectable({ providedIn: 'root' })
export class TagsService {
  constructor(private readonly http: HttpClient) {}

  /** Returns all available tags as a string array. */
  getAll(): Observable<string[]> {
    return this.http.get<{ tags: string[] }>('/tags').pipe(map(data => data.tags));
  }
}
