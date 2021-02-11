import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { PublisheventService } from '../../../services/publishevent.service';
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
  selector: 'kt-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
	id: any;
	packages: any;
	selectedItem: any;
	modalReferenc: NgbModalRef;
	homeForm: FormGroup;
  subscriptionIds : any = [];
  subscribed: any = [];
  userCard: any = [];
  IsSelectedCardOption: any;
  checkExpirtDate: any;
  loading: any;
	constructor(private ngxService: NgxUiLoaderService,
    public publisheventService: PublisheventService, public toastr:ToastrService,private layoutConfigService: LayoutConfigService , private modalService: NgbModal, private fb: FormBuilder, private changeDetection: ChangeDetectorRef, public route: ActivatedRoute, public router: Router, public adminService: AdminService, public auth: AuthService, private http: HttpClient) { }

	ngOnInit() {
    let user_id = localStorage.getItem('user_id');
		this.id = this.route.snapshot.paramMap.get('id');
		this.getInfoAboutAgent();
		this.initHomeForm();
    this.getUserSubscriptions(user_id);

    let dict = {
      "id": user_id
    };
    this.adminService.postData('getUserByID',dict).subscribe((res :any) => {
      var ExpiryDate  = res.data.expiry_date;
      var CurrentDate = new Date();
      ExpiryDate = new Date(ExpiryDate);
      // alert(GivenDate+'------'+CurrentDate);
      if(ExpiryDate < CurrentDate)
      {
        this.checkExpirtDate = 'true';
      }else{
        this.checkExpirtDate = 'false';
      }
      console.log(this.checkExpirtDate);
    });  

    //this.initConfig();
	}

  openUrl(page){
		this.router.navigate(['/' + this.id + page]);
	}

	getInfoAboutAgent()
  {
    this.ngxService.start();
  	const authData = {
  		_id: this.id
  	};

  	this.adminService.postData('getAllPackages',{}).subscribe((res :any) => {
  		console.log(res)
  		if(res.status == 1)
  		{	
  			console.log(res)
  			this.packages = res.data;
  			this.changeDetection.detectChanges();
        this.ngxService.stop();
    	}
    	else{
    		// this.loading = false;
    		console.log(res);
        this.ngxService.stop();
    	}
    });
	};

 /* private initConfig(): void 
    {
        let self = this;
        this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => <ICreateOrderRequest>{
          intent: 'authorize',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: self.selectedPlan,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: self.selectedPlan
                  }
                }
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: self.selectedPlan,
                  },
                }
              ]
            }
          ]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical'
        },
        onApprove: (data, actions) => {
          this.loading = true;
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then(details => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
          });
          const controls = self.registerForm.controls;
          
          let d = new Date();
          d.setDate(d.getDate() + Number(30));
          let expiry_date = d; 
          
          let dict = {
              "name"         : controls.fullname.value,
              "username"     : controls.username.value,
              "email"        : controls.email.value,
              "password"     : controls.password.value,
              "expiry_date"  : expiry_date,
            };

          self.adminService.postData('addUser',dict).subscribe((response:any) => {
            if(response.status == 1)
            {
              const message = 'Your account has been created successfully.';
              this.toastr.success(message, 'Success');
              // alert('')
              self.registerForm.reset();
              self.valid = false;
              this.loading = false;
            }else
            {
              const message = 'Something went wrong, please try again.';
              this.toastr.error(message, 'Error');
              // alert('');
            }
          });
        },
        onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          this.showSuccess = true;
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
        },
        onError: err => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        },
        };
    }*/

	initHomeForm(){
    // const numRegex = /^(?:(?4[0-9]{12}(?:[0-9]{3})?) | (?5[1-5][0-9]{14}) | (?6(?:011|5[0-9]{2})[0-9]{12}) | (?3[47][0-9]{13}) | (?3(?:0[0-5]|[68][0-9])[0-9]{11}) | (?(?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
    const regexCVV = /^[0-9]{3, 4}$/;

    this.homeForm = this.fb.group({
    	card_number: ['', Validators.compose([Validators.required])],
    	exp_month: ['', Validators.compose([Validators.required])],
    	exp_year: ['', Validators.compose([Validators.required])],
 	    cvv: ['', Validators.compose([Validators.required])]
    });
  };

  xyz(index, item){
  	// this.selectedPlan = price;
  	this.selectedItem = item;
  	console.log(index);
  }

  getUserSubscriptions(user_id)
  {
    let dict = {
      "user_id": user_id
    };
    this.adminService.postData('getUserSubscriptions',dict).subscribe((res :any) => {
        this.subscribed = res.data;
        for(var i=0; i < res.data.length; i++){
          
          console.log(this.subscriptionIds.indexOf(res.data[i].package_data._id));
          
          if(this.subscriptionIds.indexOf(res.data[i].package_data._id) == -1)
          {
            this.subscriptionIds.push(res.data[i].package_data._id);
          }
        }

        this.changeDetection.detectChanges();
    });
  }


  addNewCard(content, item)
  {
    this.IsSelectedCardOption = false;

    this.selectedItem = item;
    this.modalReferenc = this.modalService.open(content, { centered: true });
  };

  selectedPlan(content, item)
  {  
    // Check card exist or not ----------------------------
    let dict = {
      "userId": localStorage.getItem('user_id')
    };
    this.ngxService.start();
    this.adminService.postData('getUserCards',dict).subscribe((res :any) => {
      this.userCard = res.data;
      if(res.data.length > 0)
      {
        this.IsSelectedCardOption = true;

        this.selectedItem = item;
        this.modalReferenc = this.modalService.open(content, { centered: true });

        this.ngxService.stop();
      }
      else
      {
        this.IsSelectedCardOption = false;

        this.selectedItem = item;
        this.modalReferenc = this.modalService.open(content, { centered: true });

        this.ngxService.stop();
      }
    });
  };
    
  submit()
  {
    const controls = this.homeForm.controls;
    console.log(controls);
    /** check form */
    if (this.homeForm.invalid)
    {
      Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
      );
      return;
    }

    this.saveCard();
  }

  saveCard()
  {
    this.ngxService.start();
    const controls  = this.homeForm.controls;
    let userId      = localStorage.getItem('user_id');
    let userName    = localStorage.getItem('user_name'); 
    
    let dict = {
      "card_number": controls.card_number.value,
      "cvv": controls.cvv.value,
      "exp_month": controls.exp_month.value,
      "exp_year": controls.exp_year.value,
      "external_customer_id": userId,
      "first_name": userName.split(' ')[0],
      "last_name": userName.split(' ')[1],
      "type": "visa",
      'fullPackage': this.selectedItem
    };
    
    this.adminService.postData('storeCreditCardVault',dict).subscribe((res :any) => {

        console.log(res)
        if(res.status == 1)
        {
          console.log(res);

          let dict = {
            "_id"     : userId, 
            "package" : this.selectedItem.timePeriod,
            'fullPackage': this.selectedItem
          };

          this.adminService.postData('update_user_expiry',dict).subscribe((response:any) => {
            this.ngxService.stop();

            if(response.status == 1)
            {
              this.publisheventService.newEvent('paymentPage');
              this.ngxService.stop();
              this.modalReferenc.close();
              this.getUserSubscriptions(userId);
              this.homeForm.reset();

              this.toastr.success('Subscription purchased successfully!', 'Success');
            }
            else
            {
              this.ngxService.stop();
              this.modalReferenc.close();
              this.getUserSubscriptions(userId);
              this.homeForm.reset();

              this.toastr.error('Payment failed!', 'Error');
            }
          });
        }
        else{
          this.toastr.error('Please use valid cards.', 'Error');
          this.ngxService.stop();
        }
    });
  };

  paymentDirectByProceedNew()
  {
    if (confirm('Are you sure you want to proceed with your saved card ?'))
    {
      this.ngxService.start();
      
      let dict = {
          "user_id" : localStorage.getItem('user_id'), 
          "package" : this.selectedItem
      };

      this.adminService.postData('autoRenewalBrainTree',dict).subscribe((response:any) => {
          this.ngxService.stop();

          let dict = {
              "_id"     : localStorage.getItem('user_id'), 
              "package" : this.selectedItem.timePeriod,
              'fullPackage': this.selectedItem
            };

            this.adminService.postData('update_user_expiry',dict).subscribe((response:any) => {
              this.ngxService.stop();

              if(response.status == 1)
              {
                this.publisheventService.newEvent('paymentPage');
                this.ngxService.stop();
                this.modalReferenc.close();
                this.getUserSubscriptions(localStorage.getItem('user_id'));
                this.homeForm.reset();

                this.toastr.success('Subscription purchased successfully!', 'Success');
              }
              else
              {
                this.ngxService.stop();
                this.modalReferenc.close();
                this.getUserSubscriptions(localStorage.getItem('user_id'));
                this.homeForm.reset();

                this.toastr.error('Payment failed!', 'Error');
              }
            });
      });
    }
  }

  /*paymentDirectByProceed(userCard)
  {
    this.ngxService.start();
    const controls = this.homeForm.controls;
    let userId   = localStorage.getItem('user_id');
    let userName = localStorage.getItem('user_name'); 

    var cardData = {
      'paymentInfo': {
        "intent": "sale",
        "payer": {
          "payment_method": "credit_card",
          "funding_instruments": [{
            "credit_card_token": {
              "credit_card_id": userCard[0].card_data.id,
              "external_customer_id": userCard[0].card_data.external_customer_id
            }
          }]
        },
        "transactions": [{
          "amount": {
            "total": this.selectedItem.price,
            "currency": "USD"
          },
          "description": "This is the payment transaction description."
        }],
      },
      'userId': userCard[0].userId,
      'package': this.selectedItem
    };
    this.adminService.postData('autoRenewalPlan', cardData).subscribe((res :any) => {
        console.log(res)
         this.ngxService.stop();
         // this.modalReferenc.close();
        if(res.status == 1)
        { 
          let dict = {
              "_id"     : userCard[0].userId,
              "package" : this.selectedItem.timePeriod
          };

          this.adminService.postData('update_user_expiry',dict).subscribe((response:any) => {
            this.ngxService.stop();
            if(response.status == 1)
            {
              this.publisheventService.newEvent('paymentPage');
              this.ngxService.stop();
              console.log("after payment done"+res);
              this.modalReferenc.close();
              this.getUserSubscriptions(userId);
              this.homeForm.reset();
            }
            else
            {
              this.ngxService.stop();
              console.log("after payment done"+res);
              this.modalReferenc.close();
              this.getUserSubscriptions(userId);
              this.homeForm.reset();
            }
          });
          // console.log(res)
          // this.modalReferenc.close();
          // this.getUserSubscriptions(userId);
          // this.homeForm.reset();
          
        }
        else{
          this.toastr.error('Insufficent funds in your card or some technical issue. ', 'Error');
          this.ngxService.stop();
        }
    });
  };*/

  IsSubscribed(packageId){
    console.log(packageId);
    console.log(this.subscriptionIds)
    if(this.subscriptionIds.indexOf(packageId) == -1){
      return false;
    }else{
      return true;
    }
  };

   

}
 