import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedCardsComponent } from './saved-cards.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [SavedCardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
			{
				path: '',
				component: SavedCardsComponent
			},
		]),
  ]
})
export class SavedCardsModule { }


