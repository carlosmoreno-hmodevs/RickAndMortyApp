import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full',
  },
  {
    path: 'characters',
    loadChildren: () =>
      import('./pages/characters/characters.routes').then(
        (m) => m.CHARACTERS_ROUTES
      ),
  },
];
