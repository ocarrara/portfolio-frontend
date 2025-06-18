import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PortfolioItem, PortfolioService} from '../../services/portfolio.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.scss'],
  imports: [
    FormsModule,
    CommonModule
  ],
  standalone: true
})
export class PortfolioFormComponent implements OnInit {
  @Input() itemToEdit: PortfolioItem | null = null;
  @Output() close = new EventEmitter<any>();
  @Output() save = new EventEmitter<Partial<PortfolioItem>>();

  portfolio: Partial<PortfolioItem> = {
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: ''
  };

  isEditMode = false;
  formTitle = 'Create Portfolio Item';

  constructor(
    private portfolioService: PortfolioService
  ) {
    console.log('PortfolioFormComponent initialized');
  }

  ngOnInit(): void {
    if (this.itemToEdit) {
      this.isEditMode = true;
      this.formTitle = 'Edit Portfolio Item';

      // Create a copy of the item to edit
      this.portfolio = { ...this.itemToEdit };

      // Handle potential case mismatch between API and frontend model
      if (this.itemToEdit.imageUrl) {
        this.portfolio.imageUrl = this.itemToEdit.imageUrl;
      }

      if (this.itemToEdit.projectUrl) {
        this.portfolio.projectUrl = this.itemToEdit.projectUrl;
      }

      console.log('Editing portfolio item:', this.portfolio);
    }
  }

  onSubmit() {
    // Create a copy of the portfolio object to send to the API
    const portfolioToSend: any = { ...this.portfolio };

    // Map lowercase properties to uppercase for API compatibility
    if (portfolioToSend.imageurl) {
      portfolioToSend.imageUrl = portfolioToSend.imageurl;
    }

    if (portfolioToSend.projecturl) {
      portfolioToSend.projectUrl = portfolioToSend.projecturl;
    }

    console.log('Submitting portfolio:', portfolioToSend);

    if (this.isEditMode && this.itemToEdit) {
      this.portfolioService.update(this.itemToEdit.id, portfolioToSend as PortfolioItem).subscribe({
        next: () => {
          // Emit the updated portfolio and close the modal
          this.save.emit(this.portfolio);
        },
        error: (err: any) => {
          console.error('Error updating portfolio', err);
        },
      });
    } else {
      this.portfolioService.create(portfolioToSend).subscribe({
        next: () => {
          // Emit the created portfolio and close the modal
          this.save.emit(this.portfolio);
        },
        error: (err: any) => {
          console.error('Error creating portfolio', err);
        },
      });
    }
  }

  onCancel(): void {
    console.log('onCancel called');
    this.close.emit();
  }
}
