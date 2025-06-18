import { Component } from '@angular/core';
import { PortfolioFormComponent } from './components/portfolio-form/portfolio-form.component';
import { PortfolioListComponent } from './components/portfolio-list/portfolio-list.component';
import { PortfolioDetailComponent } from './components/portfolio-detail/portfolio-detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { PortfolioItem } from './services/portfolio.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PortfolioListComponent, PortfolioFormComponent, PortfolioDetailComponent, MatToolbar, MatIcon, MatIconButton, MatButton, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-frontend';
  showPortfolioForm = false;
  showPortfolioDetail = false;
  currentEditItem: PortfolioItem | null = null;
  currentViewItemId: number | null = null;

  openPortfolioForm(item?: PortfolioItem): void {
    console.log('Opening portfolio form...', item ? 'Edit mode' : 'Create mode');
    this.currentEditItem = item || null;
    this.showPortfolioForm = true;
    // Prevent scrolling of the background when modal is open
    document.body.style.overflow = 'hidden';
    console.log('showPortfolioForm:', this.showPortfolioForm);
  }

  handleCloseModal(): void {
    console.log('handleCloseModal called');
    this.showPortfolioForm = false;
    this.currentEditItem = null;
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = '';
    console.log('showPortfolioForm:', this.showPortfolioForm);
  }

  handleSavePortfolio(portfolio: Partial<PortfolioItem>): void {
    console.log('handleSavePortfolio called with:', portfolio);
    this.showPortfolioForm = false;
    this.currentEditItem = null;
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = '';
    console.log('showPortfolioForm:', this.showPortfolioForm);
    // Refresh the portfolio list
    window.location.reload(); // Simple solution for now
  }

  handleEditItem(item: PortfolioItem): void {
    console.log('handleEditItem called with:', item);
    this.openPortfolioForm(item);
  }

  handleDeleteItem(itemId: number): void {
    console.log('handleDeleteItem called with ID:', itemId);
    // Refresh the portfolio list
    window.location.reload(); // Simple solution for now
  }

  handleViewItem(itemId: number): void {
    console.log('handleViewItem called with ID:', itemId);
    this.currentViewItemId = itemId;
    this.showPortfolioDetail = true;
    // Prevent scrolling of the background when modal is open
    document.body.style.overflow = 'hidden';
  }

  handleCloseDetailModal(): void {
    console.log('handleCloseDetailModal called');
    this.showPortfolioDetail = false;
    this.currentViewItemId = null;
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = '';
  }
}
