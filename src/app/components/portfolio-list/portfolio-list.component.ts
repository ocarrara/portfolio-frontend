import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { PortfolioItem, PortfolioService } from '../../services/portfolio.service';
import { CommonModule, NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    CommonModule,
    MatIcon,
    MatButton,
    MatIconButton,
    MatIconAnchor,
    MatTooltip,
    MatProgressSpinner,
  ],
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {
  portfolios: PortfolioItem[] = [];
  @Output() editItem = new EventEmitter<PortfolioItem>();
  @Output() deleteItem = new EventEmitter<number>();
  @Output() viewItem = new EventEmitter<number>();

  // Maps to track image loading states
  loadingImages: { [key: number]: boolean } = {};
  loadedImages: { [key: number]: boolean } = {};
  errorImages: { [key: number]: boolean } = {};

  // Default fallback image URL
  fallbackImageUrl = 'https://picsum.photos/200/300';

  constructor(
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.portfolioService.getAll().subscribe({
      next: (data) => {
        this.portfolios = data;

        // Initialize loading states for all portfolio images
        this.portfolios.forEach(portfolio => {
          // In non-browser environments, skip image loading states initialization
          if (!isPlatformBrowser(this.platformId)) {
            return;
          }

          this.loadingImages[portfolio.id] = true;
          this.loadedImages[portfolio.id] = false;
          this.errorImages[portfolio.id] = false;

          if (portfolio.imageUrl) {
            this.preloadImage(portfolio.id, portfolio.imageUrl);
          } else {
            this.loadingImages[portfolio.id] = false;
            this.errorImages[portfolio.id] = true;
          }
        });
      },
      error: (err) => console.error('Error loading portfolios:', err)
    });
  }

  /**
   * Preloads an image and updates loading states
   */
  preloadImage(portfolioId: number, imageUrl: string): void {
    // Check if we're running in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Create image element only in browser environment
      const img = new Image();

      img.onload = () => {
        // Image loaded successfully
        this.loadingImages[portfolioId] = false;
        this.loadedImages[portfolioId] = true;
      };

      img.onerror = () => {
        // Error loading image
        this.loadingImages[portfolioId] = false;
        this.errorImages[portfolioId] = true;
        console.error(`Error loading image for portfolio ${portfolioId}`);
      };

      // Start loading the image
      img.src = imageUrl;
    } else {
      // In non-browser environments (like SSR), skip image preloading
      // Just mark the image as not loading and not in error state
      this.loadingImages[portfolioId] = false;
      this.loadedImages[portfolioId] = true;
      console.log(`Skipping image preload for portfolio ${portfolioId} in non-browser environment`);
    }
  }

  /**
   * Gets the appropriate image URL based on loading state
   */
  getImageUrl(portfolio: PortfolioItem): string {
    // In non-browser environments, just return the image URL without checking loading states
    if (!isPlatformBrowser(this.platformId)) {
      return portfolio.imageUrl || this.fallbackImageUrl;
    }

    // In browser environments, check loading states
    if (this.errorImages[portfolio.id] || (!portfolio.imageUrl)) {
      return this.fallbackImageUrl;
    }

    return portfolio.imageUrl || this.fallbackImageUrl;
  }

  onEditClick(portfolio: PortfolioItem): void {
    // Only emit the event in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.editItem.emit(portfolio);
    }
  }

  onDeleteClick(portfolio: PortfolioItem): void {
    // Only proceed with deletion in browser environment
    if (isPlatformBrowser(this.platformId)) {
      if (confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
        this.portfolioService.delete(portfolio.id).subscribe({
          next: () => {
            console.log(`Portfolio with ID ${portfolio.id} deleted successfully`);
            this.deleteItem.emit(portfolio.id);
          },
          error: (err) => {
            console.error('Error deleting portfolio:', err);
            this.snackBar.open('Error deleting portfolio', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  onViewClick(portfolio: PortfolioItem): void {
    // Only emit the event in browser environment
    if (isPlatformBrowser(this.platformId)) {
      console.log(`Viewing portfolio with ID ${portfolio.id}`);
      this.viewItem.emit(portfolio.id);
    }
  }

  /**
   * Refreshes the portfolio list and resets image loading states
   */
  refreshPortfolios(): void {
    // Reset loading states
    this.loadingImages = {};
    this.loadedImages = {};
    this.errorImages = {};

    // Reload portfolios
    this.loadPortfolios();

    // Show notification only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.snackBar.open('Refreshing portfolio list...', '', {
        duration: 2000
      });
    }
  }
}
