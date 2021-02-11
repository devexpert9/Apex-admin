// Angular
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
	imports: [
		FormsModule, ReactiveFormsModule,DragDropModule,FontAwesomeModule,
		CommonModule,NgbModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
	],
	providers: [],
	declarations: [
		DashboardComponent,
	]
})
export class DashboardModule {
}
