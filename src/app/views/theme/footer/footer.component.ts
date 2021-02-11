// Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../core/_base/layout';
// Object-Path
import * as objectPath from 'object-path';
import { AdminService } from '../../../services/admin.service';
import { PublisheventService } from '../../../services/publishevent.service';

@Component({
	selector: 'kt-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],

})
export class FooterComponent implements OnInit {
	// Public properties
	today: number = Date.now();
	fluid: boolean;

	errorChk: any='';
	diffDays: number;
	diffDays1: number;
	user_id: any = localStorage.getItem('user_id');
 
	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayouConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService, 
		public adminService: AdminService,
	    private publisheventService: PublisheventService,
	    private changeDetection: ChangeDetectorRef
		) {
		this.publisheventService.events$.forEach(event => this.getPageData());
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();

		// footer width fluid
		this.fluid = objectPath.get(config, 'footer.self.width') === 'fluid';

		// this.getPageData();


		// let dict = {
	 //        "id": localStorage.getItem('user_id')
  //     	};
  //     	this.adminService.postData('getUserByID',dict).subscribe((res :any) => {
	 //        const oneDay = 24 * 60 * 60 * 1000;
	 //        var ExpiryDate  = res.data.expiry_date;
	 //        var CurrentDate = new Date();
	 //        ExpiryDate = new Date(ExpiryDate);
	 //        // To calculate the time difference of two dates 
		// 	const start = CurrentDate.getTime();
		// 	const end = ExpiryDate.getTime();

		// 	const diff = end - start;
		// 	const seconds = Math.floor(diff / 1000);
		// 	this.diffDays1 = Math.round(Math.abs((ExpiryDate - CurrentDate) / oneDay));

		// 	console.log(this.diffDays1)
		// 	if(ExpiryDate > CurrentDate)
		// 	{
		// 		this.diffDays = this.diffDays1;
		// 	}
  //     	}); 
	}

	getPageData()
	{
	    let dict = {
	      	"page" : "home",
	      	"user_id" : this.user_id
	    };
	    this.adminService.postData('getPageData',dict).subscribe((response: any) => {
	      	console.log(response);
        	this.errorChk = response;
        	this.changeDetection.detectChanges();
	    });

	    let dict1 = {
	        "id": localStorage.getItem('user_id')
      	};
      	this.adminService.postData('getUserByID',dict1).subscribe((res :any) => {
	        const oneDay = 24 * 60 * 60 * 1000;
	        var ExpiryDate  = res.data.expiry_date;
	        var CurrentDate = new Date(),
	        ExpiryDate1 = new Date(ExpiryDate);
	        // To calculate the time difference of two dates 
			const start = CurrentDate.getTime();
			const end = ExpiryDate1.getTime();
			// alert('calling')
			const diff = end - start;
			const seconds = Math.abs(end - start);
			this.diffDays1 = Math.round( seconds / oneDay);

			console.log(this.diffDays1)
			if(ExpiryDate1 > CurrentDate)
			{
				this.diffDays = this.diffDays1;
			}

			this.changeDetection.detectChanges();
      	}); 
  	}
}
