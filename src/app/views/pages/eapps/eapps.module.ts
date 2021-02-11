import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EAPPSComponent } from '../eapps/eapps.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [EAPPSComponent],
  imports: [
    CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: EAPPSComponent
			},
		]),
  ]
})
export class EAPPSModule { }
