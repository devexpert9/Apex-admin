// Angular
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
	NavigationCancel,
	NavigationEnd,
	NavigationStart,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router
} from '@angular/router';
// Object-Path
import * as objectPath from 'object-path';
// Loading bar
import { LoadingBarService } from '@ngx-loading-bar/core';
// Layout
import { LayoutConfigService, LayoutRefService } from '../../../core/_base/layout';
// HTML Class Service
import { HtmlClassService } from '../html-class.service';


// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// Layout
// import { LayoutConfigService } from '../../../core/_base/layout';
// Object-Path
// import * as objectPath from 'object-path';
import { AdminService } from '../../../services/admin.service';
import { PublisheventService } from '../../../services/publishevent.service';

@Component({
	selector: 'kt-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
	// Public properties
	menuHeaderDisplay: boolean;
	fluid: boolean;
	today: number = Date.now();
	

	errorChk: any='';
	diffDays: number;
	diffDays1: number;
	user_id: any = localStorage.getItem('user_id');

	@ViewChild('ktHeader', {static: true}) ktHeader: ElementRef;

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param layoutRefService: LayoutRefService
	 * @param layoutConfigService: LayoutConfigService
	 * @param loader: LoadingBarService
	 * @param htmlClassService: HtmlClassService
	 */
	constructor(
		private router: Router,
		private layoutRefService: LayoutRefService,
		private layoutConfigService: LayoutConfigService,
		public loader: LoadingBarService,
		public htmlClassService: HtmlClassService,
		public adminService: AdminService,
	    private publisheventService: PublisheventService,
	    private changeDetection: ChangeDetectorRef
	) {
		// page progress bar percentage
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				// set page progress bar loading to start on NavigationStart event router
				this.loader.start();
			}
			if (event instanceof RouteConfigLoadStart) {
				this.loader.increment(35);
			}
			if (event instanceof RouteConfigLoadEnd) {
				this.loader.increment(75);
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				// set page progress bar loading to end on NavigationEnd event router
				this.loader.complete();
			}
		});
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

		// get menu header display option
		this.menuHeaderDisplay = objectPath.get(config, 'header.menu.self.display');

		// header width fluid
		this.fluid = objectPath.get(config, 'header.self.width') === 'fluid';

		// animate the header minimize the height on scroll down
		if (objectPath.get(config, 'header.self.fixed.desktop.enabled') || objectPath.get(config, 'header.self.fixed.desktop')) {
			// header minimize on scroll down
			this.ktHeader.nativeElement.setAttribute('data-ktheader-minimize', '1');
		}
		this.getPageData();
	}

	ngAfterViewInit(): void {
		// keep header element in the service
		this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
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
