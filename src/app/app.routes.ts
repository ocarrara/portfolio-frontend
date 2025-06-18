import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioListComponent } from './components/portfolio-list/portfolio-list.component';
import { PortfolioFormComponent } from './components/portfolio-form/portfolio-form.component';

export const routes: Routes = [
  { path: '', component: PortfolioListComponent },
  { path: 'create', component: PortfolioFormComponent },
  { path: 'edit/:id', component: PortfolioFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
