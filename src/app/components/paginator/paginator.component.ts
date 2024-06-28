import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() changePage = new EventEmitter<number>();
  pages = [];
  pageSize = 10;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages']) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  }

  /**
   * Gets the paginated items based on the current page and total number of pages.
   * @returns An array of numbers representing the paginated items. Max 10 items.
   */
  get paginatedItems(): number[] {
    const MAX_PAGES = 9;
    if (this.totalPages <= MAX_PAGES) {
      return this.pages;
    }
    let previous = 4;
    let after = 4;
    let start = 0;
    let end = this.totalPages - 1;

    if (this.currentPage < 5) {
      after += 5 - this.currentPage;
      previous -= 5 - this.currentPage;
    }

    if (this.currentPage > this.totalPages - 5) {
      previous += this.currentPage - this.totalPages + 5;
      after -= this.currentPage - this.totalPages + 5;
    }

    start = this.currentPage - previous - 1;
    end = this.currentPage + after;
    return this.pages.slice(start, end + 1);
  }

  onChangePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.changePage.emit(page);
  }
}
