import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,NgbModule,FormsModule, ReactiveFormsModule,NgxPayPalModule,HttpClientModule,
    RouterModule.forChild([
		{
			path: '',
			component: PaymentComponent
		},
	]),
  ]
})
export class PaymentModule { }
