import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RickandmortyService } from '../../../services/rickandmorty.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Characters, CharactersResponse } from '../../../interfaces/characters';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    PaginatorComponent,
    MatSidenavModule,
    RouterLink,
    MatProgressBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatAccordion,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent implements OnInit {
  loading: boolean = true;
  characters: Characters[] = [];
  charactersResponse: CharactersResponse = {} as CharactersResponse;
  currentPage = 1;
  filterForm: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  constructor(
    private rickAndMortyService: RickandmortyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      status: [''],
      species: [''],
      type: [''],
      gender: [''],
      name: [''],
    });
  }

  get status() {
    return this.filterForm.get('status');
  }
  get species() {
    return this.filterForm.get('species');
  }
  get type() {
    return this.filterForm.get('type');
  }
  get gender() {
    return this.filterForm.get('gender');
  }
  get name() {
    return this.filterForm.get('name');
  }

  ngOnInit(): void {
    this.loadFilteredCharacters(false);
  }

  loadCharacters(): void {
    this.loading = true;
    this.rickAndMortyService
      .getCharacters(this.currentPage)
      .subscribe((data) => {
        this.charactersResponse = data;
        this.characters = data.results;
        this.loading = false;
      });
  }

  loadFilteredCharacters(fromFilter: boolean): void {
    this.loading = true;
    this.rickAndMortyService
      .getFilteredCharacters(
        fromFilter ? 1 : this.currentPage,
        this.status.value,
        this.species.value,
        this.type.value,
        this.gender.value,
        this.name.value
      )
      .subscribe(
        (data) => {
          this.charactersResponse = data;
          this.characters = data.results;
          if (this.options.length == 0) {
            this.options = this.characters.map((character) => character.name);
          }
          this.loading = false;
          this.filteredOptions = this.name.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
        },
        (err) => {
          this.charactersResponse = {} as CharactersResponse;
          this.characters = [];
          this.loading = false;
        }
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  async onChangePage(page: number) {
    this.currentPage = page;
    await this.loadFilteredCharacters(false);
    this.scrollToTop();
  }

  submitFilter(): void {
    this.loadFilteredCharacters(true);
  }

  refreshRoute(): void {
    this.router.navigate([this.router.url]).then(() => {
      window.location.reload();
    });
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
