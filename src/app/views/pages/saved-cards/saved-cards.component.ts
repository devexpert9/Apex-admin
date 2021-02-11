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
  selector: 'kt-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.scss']
})
export class SavedCardsComponent implements OnInit {
	card:any; 
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
          this.getUserCrads(user_id);
        }
      }); 
    //-----------------------------------------------------------------

  	
  }

  deleteCard()
  {
    if (confirm('Are you sure you want to delete this card. It will stop auto deduction from your account after your subscription ends.'))
    {
      this.ngxService.start();
      let dict = {
          "userId": localStorage.getItem('user_id')
        };
        this.adminService.postData('DeleteCardByID',dict).subscribe((res :any) => {
            
            this.getUserCrads(localStorage.getItem('user_id'));
            this.changeDetection.detectChanges();
            this.ngxService.stop();
            this.toastr.success('Card has been deleted successfully.', 'Success');
        }); 
    }
    
  }

  getUserCrads(user_id)
  {
  	this.ngxService.start();
  	let dict = {
      "userId": user_id
    };
    this.adminService.postData('getUserCards',dict).subscribe((res :any) => {
    	this.card = res.data;
    	this.changeDetection.detectChanges();
    	this.ngxService.stop();
    });
  }
}
