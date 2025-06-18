import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // Initialize baseUrl from environment configuration
    this.baseUrl = `${environment.backendBaseUrl}/Portfolio`;

    // Check if the URL is relative (starts with /)
    if (this.baseUrl.startsWith('/')) {
      console.log('Portfolio service using relative URL with proxy:', this.baseUrl);
    } else {
      console.log('Portfolio service using absolute backend URL:', this.baseUrl);
    }
  }

  getAll(): Observable<PortfolioItem[]> {
    console.log('Getting all portfolios from: ', this.baseUrl, '...');
    return this.http.get<PortfolioItem[]>(this.baseUrl);
  }

  get(id: number): Observable<PortfolioItem> {
    console.log('Getting portfolio with ID:', id, 'from:', this.baseUrl, '...');
    return this.http.get<PortfolioItem>(`${this.baseUrl}/${id}`);
  }

  create(item: Partial<PortfolioItem>): Observable<PortfolioItem> {
    console.log('Creating portfolio with:', item, '...');
    return this.http.post<PortfolioItem>(this.baseUrl, item);
  }

  update(id: number, item: PortfolioItem): Observable<void> {
    console.log('Updating portfolio with ID:', id, 'to:', item, '...');
    return this.http.put<void>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    console.log('Deleting portfolio with ID:', id, '...');
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
