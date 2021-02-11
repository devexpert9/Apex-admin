import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    FormsModule, ReactiveFormsModule,	
    CommonModule,PartialsModule,CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: ContactComponent
			},
		]),
  ]
})
export class ContactModule { }
