import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RickandmortyService {
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor() {}

  getCharacters(page: number = 1): Observable<any> {
    return this._http.get(`${this.apiUrl}/character/?page=${page}`);
  }

  getCharacter(id: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/character/${id}`);
  }

  getCharacterRelated(name: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/character/?name=${name}`);
  }

  getFilteredCharacters(
    page: number = 1,
    status: string = '',
    species: string = '',
    type: string = '',
    gender: string = '',
    name: string = ''
  ): Observable<any> {
    return this._http.get(
      `${this.apiUrl}/character/?status=${status}&species=${species}&type=${type}&gender=${gender}&name=${name}&page=${page}`
    );
  }

  getEpisodes(page: number = 1): Observable<any> {
    return this._http.get(`${this.apiUrl}/episode/?page=${page}`);
  }

  getEpisode(id: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/episode/${id}`);
  }

  getMultipleEpisodes(episodes: any): Observable<any> {
    return this._http.get(`${this.apiUrl}/episode/${episodes}`);
  }

  getLocation(id: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/location/${id}`);
  }
}
