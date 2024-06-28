import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CharactersComponent } from './characters.component';
import { RickandmortyService } from '../../../services/rickandmorty.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;
  let rickAndMortyService: RickandmortyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CharactersComponent,
        MatCardModule,
        MatButtonModule,
        PaginatorComponent,
        MatSidenavModule,
        RouterModule,
        MatProgressBarModule
      ],
      providers: [RickandmortyService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharactersComponent);
    component = fixture.componentInstance;
    rickAndMortyService = TestBed.inject(RickandmortyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to top', () => {
    const scrollToSpy = spyOn(window, 'scrollTo');

    component.scrollToTop();

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});
