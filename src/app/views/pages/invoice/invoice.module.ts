import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
		{
			path: '',
			component: InvoiceComponent
		},
	]),
  ]
})
export class InvoiceModule { }