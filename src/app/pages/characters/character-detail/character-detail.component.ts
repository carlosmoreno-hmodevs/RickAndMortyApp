import { Component, Inject, OnInit } from '@angular/core';
import { RickandmortyService } from '../../../services/rickandmorty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Characters } from '../../../interfaces/characters';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
})
export class CharacterDetailComponent implements OnInit {
  loading: boolean = true;
  character: Characters = {} as Characters;
  charactersRelated: Characters[] = [];
  episodes: any[] = [];
  constructor(
    private rickAndMortyService: RickandmortyService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('nId');
    this.loadCharacter(id);
  }

  loadCharacter(id: string): void {
    this.rickAndMortyService.getCharacter(id).subscribe((data) => {
      this.character = data;

      let episodes = this.character.episode.map((episode: string) =>
        episode.split('/').pop()
      );
      let firstName = this.character.name.split(' ')[0];

      forkJoin({
        related: this.loadRelated(firstName),
        episodes: this.loadEpisodes(episodes),
      }).subscribe(() => {
        this.loading = false;
      });
    });
  }

  loadRelated(name: string): Observable<void> {
    return this.rickAndMortyService.getCharacterRelated(name).pipe(
      map((data) => {
        this.charactersRelated = data.results
          .filter((character: Characters) => character.id !== this.character.id)
          .slice(0, 3);
      })
    );
  }

  loadEpisodes(episodes: any): Observable<void> {
    return this.rickAndMortyService.getMultipleEpisodes(episodes).pipe(
      map((data) => {
        this.episodes = Array.isArray(data) ? data : [data];
      })
    );
  }

  openLocation(url: string) {
    if (url !== '') {
      const id = url.split('/').pop();
      this.dialog.open(Dialog, {
        data: {
          dialog: 'location',
          id: id,
        },
      });
    }
  }

  openEpisode(id: string) {
    this.dialog.open(Dialog, {
      data: {
        dialog: 'episode',
        id: id,
      },
    });
  }

  goToCharacter(id: number) {
    this.router.navigate(['characters/character', id]);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getAnimationDelayClass(index: number): string {
    const delay = (index + 1) * 0.5;
    return `animate__delay-${delay}s`;
  }
}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    DatePipe,
    MatProgressSpinnerModule,
  ],
})
export class Dialog {
  loading: boolean = true;
  location: any = {};
  episode: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rickAndMortyService: RickandmortyService
  ) {
    if (this.data.dialog === 'episode') {
      this.rickAndMortyService.getEpisode(this.data.id).subscribe((data) => {
        this.episode = data;
        this.loading = false;
      });
    } else {
      this.rickAndMortyService.getLocation(this.data.id).subscribe((data) => {
        this.location = data;
        this.loading = false;
      });
    }
  }
}
