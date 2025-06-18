import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PortfolioItem, PortfolioService } from '../../services/portfolio.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss'],
  imports: [
    CommonModule,
    MatIcon,
    MatButton,
    MatProgressSpinner
  ],
  standalone: true
})
export class PortfolioDetailComponent implements OnInit {
  @Input() portfolioId: number | null = null;
  @Output() close = new EventEmitter<any>();

  portfolio: PortfolioItem | null = null;
  loading = false;
  error = false;

  constructor(private portfolioService: PortfolioService) {
    console.log('PortfolioDetailComponent initialized');
  }

  ngOnInit(): void {
    if (this.portfolioId) {
      this.loadPortfolio(this.portfolioId);
    }
  }

  loadPortfolio(id: number): void {
    this.loading = true;
    this.error = false;

    this.portfolioService.get(id).subscribe({
      next: (data) => {
        this.portfolio = data;
        this.loading = false;

        console.log('Loaded portfolio item:', this.portfolio);
      },
      error: (err) => {
        console.error('Error loading portfolio item:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  onClose(): void {
    console.log('onClose called');
    this.close.emit();
  }

  getImageUrl(): string {
    if (!this.portfolio) {
      return '';
    }

    return this.portfolio.imageUrl || 'https://picsum.photos/200/300';
  }
}
