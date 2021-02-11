import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintextComponent } from '../maintext/maintext.component';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MaintextComponent],
  imports: [
  	FormsModule, ReactiveFormsModule,	
      CommonModule,PartialsModule,CoreModule,RichTextEditorAllModule,
		RouterModule.forChild([
			{
				path: '',
				component: MaintextComponent
			},
		]),
  ]
})
export class MaintextModule { }
