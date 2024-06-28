import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CharacterDetailComponent, Dialog } from './character-detail.component';
import { RickandmortyService } from '../../../services/rickandmorty.service';
import { Characters } from '../../../interfaces/characters';

describe('CharacterDetailComponent', () => {
  let component: CharacterDetailComponent;
  let fixture: ComponentFixture<CharacterDetailComponent>;
  let rickAndMortyService: jasmine.SpyObj<RickandmortyService>;
  let route: ActivatedRoute;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const rickAndMortyServiceMock = jasmine.createSpyObj('RickandmortyService', ['getCharacter', 'getCharacterRelated', 'getMultipleEpisodes', 'getEpisode', 'getLocation']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate', 'routeReuseStrategy']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CharacterDetailComponent, Dialog],
      providers: [
        { provide: RickandmortyService, useValue: rickAndMortyServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterDetailComponent);
    component = fixture.componentInstance;
    rickAndMortyService = TestBed.inject(RickandmortyService) as jasmine.SpyObj<RickandmortyService>;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    rickAndMortyService.getCharacter.and.returnValue(of({
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
            name: "Earth (C-137)",
            url: "https://rickandmortyapi.com/api/location/1"
        },
        location: {
            name: "Citadel of Ricks",
            url: "https://rickandmortyapi.com/api/location/3"
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
            "https://rickandmortyapi.com/api/episode/1",
            "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z"
    }));

    fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadCharacter with the correct id', () => {
      spyOn(component, 'loadCharacter');
      component.ngOnInit();
      expect(component.loadCharacter).toHaveBeenCalledWith('1');
    });
  });

  describe('loadCharacter', () => {
    it('should set the character and call loadRelated and loadEpisodes', () => {
      const character: Characters = {
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
            name: "Earth (C-137)",
            url: "https://rickandmortyapi.com/api/location/1"
        },
        location: {
            name: "Citadel of Ricks",
            url: "https://rickandmortyapi.com/api/location/3"
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
            "https://rickandmortyapi.com/api/episode/1",
            "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z"
      };
      const relatedCharacters: Characters[] = [{
        id: 2,
        name: "Morty Smith",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "unknown",
          url: ""
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3"
        },
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/2",
        created: "2017-11-04T18:50:21.651Z"
      }];
      const episodes: any[] = [{ id: 1, name: 'Episode 1' }];
      rickAndMortyService.getCharacter.and.returnValue(of(character));
      rickAndMortyService.getCharacterRelated.and.returnValue(of({ results: relatedCharacters }));
      rickAndMortyService.getMultipleEpisodes.and.returnValue(of(episodes));
      component.loadCharacter('1');
      expect(component.character).toEqual(character);
      expect(component.charactersRelated).toEqual(relatedCharacters);
      expect(component.episodes).toEqual(episodes);
      expect(component.loading).toBeFalse();
    });
  });

  describe('loadRelated', () => {
    it('should set the charactersRelated', () => {
      const relatedCharacters: Characters[] = [{
        id: 2,
        name: "Morty Smith",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "unknown",
          url: ""
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3"
        },
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/2",
        created: "2017-11-04T18:50:21.651Z"
      }];
      rickAndMortyService.getCharacterRelated.and.returnValue(of({ results: relatedCharacters }));
      component.loadRelated('Rick').subscribe(() => {
        expect(component.charactersRelated).toEqual(relatedCharacters);
      });
    });
  });

  describe('loadEpisodes', () => {
    it('should set the episodes', () => {
      const episodes: any[] = [{ id: 1, name: 'Episode 1' }];
      rickAndMortyService.getMultipleEpisodes.and.returnValue(of(episodes));
      component.loadEpisodes(['1']).subscribe(() => {
        expect(component.episodes).toEqual(episodes);
      });
    });
  });

  describe('openLocation', () => {
    it('should open the location dialog', () => {
      component.openLocation('https://rickandmortyapi.com/api/location/1');
      expect(dialog.open).toHaveBeenCalledWith(Dialog, { data: { dialog: 'location', id: '1' } });
    });

    it('should not open the location dialog if the url is empty', () => {
      component.openLocation('');
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });

  describe('openEpisode', () => {
    it('should open the episode dialog', () => {
      component.openEpisode('1');
      expect(dialog.open).toHaveBeenCalledWith(Dialog, { data: { dialog: 'episode', id: '1' } });
    });
  });

  describe('goToCharacter', () => {
    it('should navigate to the character detail page', () => {
      component.goToCharacter(8);
      expect(router.navigate).toHaveBeenCalledWith(['characters/character', 8]);
    });
  });

  describe('getAnimationDelayClass', () => {
    it('should return the correct animation delay class', () => {
      expect(component.getAnimationDelayClass(0)).toBe('animate__delay-0.5s');
      expect(component.getAnimationDelayClass(1)).toBe('animate__delay-1s');
      expect(component.getAnimationDelayClass(2)).toBe('animate__delay-1.5s');
    });
  });
});
