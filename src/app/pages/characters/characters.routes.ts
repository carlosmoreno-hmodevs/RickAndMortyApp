import { Routes } from '@angular/router';
import { CharactersComponent } from './characters/characters.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';

export const CHARACTERS_ROUTES: Routes = [
  { path: '', component: CharactersComponent },
  { path: 'character/:nId', component: CharacterDetailComponent },
];
