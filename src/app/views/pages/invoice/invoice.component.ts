import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../core/auth.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { ToastrService } from 'ngx-toastr';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
	id: any;
	packages: any;
	selectedItem: any;
	modalReferenc: NgbModalRef;
	homeForm: FormGroup;
  	subscriptionIds : any = [];
  	subscribed: any = [];
	constructor(private ngxService: NgxUiLoaderService, public toastr:ToastrService,private layoutConfigService: LayoutConfigService , private modalService: NgbModal, private fb: FormBuilder, private changeDetection: ChangeDetectorRef, public route: ActivatedRoute, public router: Router, public adminService: AdminService, public auth: AuthService, private http: HttpClient) { }

  	ngOnInit()
  	{
  		//--- Check if Expired then send to subscription page --------------
	      let dict = {
	        "id": localStorage.getItem('user_id')
	      };
	      this.adminService.postData('getUserByID',dict).subscribe((res :any) => {
	        var ExpiryDate  = res.data.expiry_date;
	        var CurrentDate = new Date();
	        ExpiryDate = new Date(ExpiryDate);
	        // alert(GivenDate+'------'+CurrentDate);
	        if(ExpiryDate < CurrentDate)
	        {
	          	// alert('go to subs')
	          	this.router.navigate(['./subscription']);
	        }
	        else{
	          	let user_id = localStorage.getItem('user_id');
    			this.getUserSubscriptions(user_id);
	        }
	      }); 
	    //-----------------------------------------------------------------

  		
  	}

  	getUserSubscriptions(user_id){
	    let dict = {
	      "user_id": user_id
	    };
	    this.adminService.postData('getUserSubscriptions',dict).subscribe((res :any) => {
	        this.subscribed = res.data;
	        this.changeDetection.detectChanges();
	    });
  	};

}
