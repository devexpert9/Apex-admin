import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    FormsModule, ReactiveFormsModule,	
    CommonModule,PartialsModule,CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: ProfileComponent
			},
		]),
  ]
})
export class ProfileModule { }
