// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
// import { MailModule } from './apps/mail/mail.module';
// import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
// import { UserManagementModule } from './user-management/user-management.module';
// import { MyPageComponent } from './my-page/my-page.component';
import { AdminService } from '../../services/admin.service';
import { HttpModule, RequestOptions } from '@angular/http';
import { ApilinkService } from '../../services/apilink.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SupportModule } from './support/support.module';
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from '../../core/_base/crud';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		PartialsModule,
		HttpModule,
		DragDropModule,
		SupportModule,

		// MailModule,
		// ECommerceModule,
		// UserManagementModule,
	],
	providers: [
		AdminService,LayoutUtilsService,
		{ provide: RequestOptions, useClass: ApilinkService },
	]
})
export class PagesModule {
}
