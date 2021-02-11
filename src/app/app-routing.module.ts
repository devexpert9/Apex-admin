// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
import { SupportComponent } from './views/pages/support/support.component';
// Auth
// import { AuthGuard } from './core/auth';
import { AuthGuard } from 'app/views/pages/core/auth.guard';
const routes: Routes = [
{path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},
{
	path: 'support/:id',loadChildren: () => import('app/views/pages/support/support.module').then(m => m.SupportModule)
		},
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'eapps',
				loadChildren: () => import('app/views/pages/eapps/eapps.module').then(m => m.EAPPSModule)
			},
			{
				path: 'home',
				loadChildren: () => import('app/views/pages/home/home.module').then(m => m.HomeModule)
			},
			{
				path: 'maintext',
				loadChildren: () => import('app/views/pages/maintext/maintext.module').then(m => m.MaintextModule)
			},
			{
				path: 'aboutme',
				loadChildren: () => import('app/views/pages/aboutme/aboutme.module').then(m => m.AboutmeModule)
			},
			{
				path: 'blog',
				loadChildren: () => import('app/views/pages/blog/blog.module').then(m => m.BlogModule)
			},
			{
				path: 'contact',
				loadChildren: () => import('app/views/pages/contact/contact.module').then(m => m.ContactModule)
			},
			{
				path: 'savedcards',
				loadChildren: () => import('app/views/pages/saved-cards/saved-cards.module').then(m => m.SavedCardsModule)
			},
			{
				path: 'invoices',
				loadChildren: () => import('app/views/pages/invoice/invoice.module').then(m => m.InvoiceModule)
			},
			{
				path: 'profile',
				loadChildren: () => import('app/views/pages/profile/profile.module').then(m => m.ProfileModule)
			},
			{
				path: 'subscription',
				loadChildren: () => import('app/views/pages/payment/payment.module').then(m => m.PaymentModule)
			},
			
			/*{
				path: 'mail',
				loadChildren: () => import('app/views/pages/apps/mail/mail.module').then(m => m.MailModule)
			},
			{
				path: 'ecommerce',
				loadChildren: () => import('app/views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
			},
			{
				path: 'ngbootstrap',
				loadChildren: () => import('app/views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule)
			},
			{
				path: 'material',
				loadChildren: () => import('app/views/pages/material/material.module').then(m => m.MaterialModule)
			},
			{
				path: 'user-management',
				loadChildren: () => import('app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'wizard',
				loadChildren: () => import('app/views/pages/wizard/wizard.module').then(m => m.WizardModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},*/
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
			
		]
	},
	{
	
				path: 'support',
				loadChildren: () => import('app/views/pages/support/support.module').then(m => m.SupportModule)
			
		},
	//{path: 'support', loadChildren: () => import('app/views/pages/support/support.module').then(m => m.SupportModule), pathMatch: 'full'},
	{path: '**', redirectTo: 'support', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {useHash:true})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
