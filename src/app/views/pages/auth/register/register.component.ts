// addedData
// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { AuthNoticeService, AuthService, Register, User } from '../../../../core/auth/';
import { Subject } from 'rxjs';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { AdminService } from '../../../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

declare var Stripe: any;

@Component({
	selector: 'kt-register',
	templateUrl: './register.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
	public payPalConfig?: IPayPalConfig;
	paymentData: any;
	registerForm: FormGroup;
	homeForm: FormGroup;
	loading = false;
	errors: any = [];

	valid: any = false;
	selectedPlan: any = 1.99;
	showSuccess:any;
	packages:any;
	addedData:any;
	emailExist:any = '';
	modalReferenc: any;
	DefaultPrice: any;
	userName: any;
	userInfo: any;
	tempUserId: any;
	DefaultPackageInterval: any;
	DefaultPackage: any;
	IsPaymentEnable: any = 0;
	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param router: Router
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 */
	constructor(
		private ngxService: NgxUiLoaderService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private auth: AuthService,
      	public toastr:ToastrService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		 public adminService: AdminService,
		private cdr: ChangeDetectorRef,
		private modalService: NgbModal
	) {
		this.unsubscribe = new Subject();
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On init
	 */
	ngOnInit() 
	{
		let dict3 = {
        	"page" : "home",
      	};
  //     	this.adminService.postData('getAllPackages',dict3).subscribe((response: any) => {
	 //        console.log("packages = "+response.data);
	 //        this.packages = response.data;
	 //       	this.cdr.detectChanges();
  //     	});

      	this.adminService.postData('signup_getPackageByStatus',dict3).subscribe((response: any) => {
	        console.log("signup packages = "+response.data);
	        if(response.status == 1){
	        	this.IsPaymentEnable = 1;
	        }
	        this.packages = response.data;
	        this.DefaultPrice 	= response.data.price;
	        this.DefaultPackage = response.data;
	        this.DefaultPackageInterval = response.data.timePeriod;
	       	this.cdr.detectChanges();
      	});

		this.initRegisterForm();
    	//this.initConfig();
    	this.initHomeForm();
	}

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

  	onChanges(): void {
	    this.registerForm.valueChanges.subscribe(val => {
	      this.valid = false;
	    });
  	}

	/*
    * On destroy
    */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegisterForm() {
		let regexpUsername = /^[A-Za-z]+$/;
		let regexp = /^\S*$/;

		this.registerForm = this.fb.group({
			fullname: ['', Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(100)
			])
			],
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			]),
			],
			username: ['', Validators.compose([
				Validators.required,
				Validators.pattern(regexpUsername),
				Validators.pattern(regexp),
				Validators.minLength(6),
				Validators.maxLength(100)
			]),
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.pattern(regexp),
				Validators.minLength(6),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(100)
			])
			],
			agree: [false, Validators.compose([Validators.required])]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});

		this.onChanges();
	}

	/**
	 * Form Submit
	 */

 	submit(price)
  	{
	    this.selectedPlan = price;
	    const controls = this.registerForm.controls;
	    console.log(controls);
	    /** check form */
	    if (this.registerForm.invalid)
	    {
	      Object.keys(controls).forEach(controlName =>
	        controls[controlName].markAsTouched()
	      );
	      return;
	    }

      	let dict = {
        	"email" : controls.email.value
      	};

      	this.adminService.postData('checkEmailExist',dict).subscribe((response:any) => {
      	console.log(response)
	        if(response.status == 0)
	        {
	          this.valid = true;
	          this.cdr.markForCheck();
	          // document.getElementById("myBtn").click();
	        }
	        else{
	          this.valid = false;

	          	const message = 'Email already exist in our system.';
	  			this.toastr.error(message, 'Error');
	          // alert('');
	        }
      	});
  	};
 
  	/*private initConfig(): void {
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
	            "name"     	   : controls.fullname.value,
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
 
	submit1(content)
	{
		const controls = this.registerForm.controls;

		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.userName = controls.username.value
		this.ngxService.start();
		let dict = {
        	"email" : controls.email.value,
        	"username": controls.username.value
      	};

      	this.adminService.postData('checkEmailExist',dict).subscribe((response:any) => {
      		// console.log(controls);return false;
	        if(response.status == 0)
	        {
	        	localStorage.setItem('signupName',controls.username.value);
	        	localStorage.setItem('signupEmail',controls.email.value);
	        	localStorage.setItem('signupUsername',controls.username.value);
	        	localStorage.setItem('signupPassword',controls.password.value);

	        	this.ngxService.stop();
	        	this.modalReferenc = this.modalService.open(content, { centered: true 
		          	});
	        }
	        else{
	        	this.ngxService.stop();
	          	this.valid 		= false;
	          	const message 	= 'Email already exist in our system.';
	  			this.toastr.error(message, response.error);
	        }
      	});

		
	}

 
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}


	proceedPayment()
  	{
  		// alert('manmohit');
	    const controls = this.homeForm.controls;
	    console.log(controls);
	    if (this.homeForm.invalid)
	    {
	      Object.keys(controls).forEach(controlName =>
	          controls[controlName].markAsTouched()
	      );
	      return;
	    }
	    // alert('HERE')
	    //this.saveCard();
  	};

  	submit11(content){
  		const controls = this.registerForm.controls;

		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}


		this.adminService.postData('signup_getPackageByStatus',{}).subscribe((response: any) => {
	        console.log("signup packages = "+response.data);
	        if(response.status == 1){
	        	this.IsPaymentEnable = 1;
	        }
	        this.packages = response.data;
	        this.DefaultPrice 	= response.data.price;
	        this.DefaultPackage = response.data;
	        this.DefaultPackageInterval = response.data.timePeriod;
	       	this.cdr.detectChanges();
      	
	       	if(response.status == 1){
	       		this.userName = controls.username.value
				this.ngxService.start();
				let dict = {
		        	"email" : controls.email.value,
		        	"username": controls.username.value
		      	};

		      	this.adminService.postData('checkEmailExist',dict).subscribe((response:any) => {
		      		console.log(response)
			        if(response.status == 0)
			        {
			        	//register user here
			        	this.valid = true;
						//--- CODE TO REGISTER USER-------------------------
						this.loading = true;
						let d = new Date();
							d.setDate(d.getDate() + Number(30));
							let expiry_date = d; 
						const controls = this.registerForm.controls;
						const authData = {
							email 	 : controls.email.value,
							username : controls.username.value,
							name : controls.fullname.value,
							password : controls.password.value,
							expiry_date : expiry_date
						};
						console.log('staep 1');
						this.adminService.postData('addUser',authData).subscribe((res :any) => {
				      		console.log('staep 2');
				      		this.loading = false;

				      		// SAVE USER INFO ------------------
				      		this.userInfo = res;
				      		// OPEN MODEL FOR PAYMENT ----------
				      		this.ngxService.stop();
				      	
				      		if(res.status == 1)
				      		{
				      			localStorage.setItem('isLoggedIn', 'true');
					      		localStorage.setItem('user_id', res.data._id);
					      		localStorage.setItem('user_name', res.data.name);
					      		localStorage.setItem('user_email', res.data.email);
					      		localStorage.setItem('portal', res.data.username);

				      			const message = 'Your account has been created successfully.';
				          		this.toastr.success(message, 'Success');

					      		this.router.navigate(['./dashboard']);
					      	}
					      	else{
					      		this.loading = false;
					      		const message = 'Something went wrong';
				          		this.toastr.error(res.error, 'Error');
					      	}
				    	});
			        }
			        else{
			        	this.ngxService.stop();
			          	this.valid 		= false;
			          	const message 	= 'Email already exist in our system.';
			  			this.toastr.error(message, response.error);
			        }
	      		});
	      	}else{
	      		this.ngxService.stop();
	        	this.modalReferenc = this.modalService.open(content, { centered: true 
		          	});
	      	}

			
      	});
  	}


  	/*saveCard()
  	{
			this.ngxService.start();
			const controls 	= this.homeForm.controls;

			let userId 		= this.userInfo.data._id;
			this.tempUserId = this.userInfo.data._id;
			let userName 	= this.userInfo.data.name; 

			let dict = {
			"card_number"	: controls.card_number.value,
			"cvv" 		: controls.cvv.value,
			"exp_month"	: controls.exp_month.value,
			"exp_year"	: controls.exp_year.value,
			"external_customer_id": userId,
			"first_name"	: this.userName.split(' ')[0],
			"last_name"	: this.userName.split(' ')[1],
			"type"		: "visa"
			};
			this.adminService.postData('storeCreditCardVault',dict).subscribe((res :any) => {

			console.log(res)
			if(res.status == 1)
			{ 
			console.log(res)
			var cardData = {
			'paymentInfo': {
			"intent": "sale",
			"payer": {
			"payment_method": "credit_card",
			"funding_instruments": [{
			"credit_card_token": {
			"credit_card_id": res.data.card_data.id,
			"external_customer_id": res.data.card_data.external_customer_id
			}
			}]
			},
			"transactions": [{
			"amount": {
			"total": this.DefaultPrice,
			"currency": "USD"
			},
			"description": "This is the payment transaction description."
			}],
			},
			'userId': userId,
			'package': this.DefaultPackage
			};
			this.adminService.postData('autoRenewalPlan', cardData).subscribe((res :any) => {
			console.log(res)
			this.modalReferenc.close();
			if(res.status == 1)
			{ 

				this.valid = true;
			//--- CODE TO REGISTER USER-------------------------
			this.loading = true;
			let d = new Date();
				d.setDate(d.getDate() + Number(30));
				let expiry_date = new Date(); 
			const controls = this.registerForm.controls;
			const authData = {
				email 	 : controls.email.value,
				username : controls.username.value,
				name : controls.fullname.value,
				password : controls.password.value,
				expiry_date : expiry_date,
				tempUserId: this.tempUserId
			};
			console.log('staep 1');
			this.adminService.postData('addUserFront',authData).subscribe((res :any) => {
					console.log('staep 2');
					this.loading = false;

					// SAVE USER INFO ------------------
					this.userInfo = res;
					// OPEN MODEL FOR PAYMENT ----------
					this.ngxService.stop();
				
					if(res.status == 1)
					{
						let dict = {
			            "_id"     : res._id, 
			            "package" : this.DefaultPackageInterval
			        };

			    	this.adminService.postData('update_user_expiryDuringSignup',dict).subscribe((response:any) => {
			  			localStorage.setItem('isLoggedIn', 'true');
			      		localStorage.setItem('user_id', res.data._id);
			      		localStorage.setItem('user_name', res.data.name);
			      		localStorage.setItem('user_email', res.data.email);
			      		localStorage.setItem('portal', res.data.username);

			  			const message = 'Your account has been created successfully.';
			      		this.toastr.success(message, 'Success');

			      		this.router.navigate(['./dashboard']);
			      	});
			  	}
			  	else{
			  		this.loading = false;
			  		const message = 'Something went wrong';
			  		this.toastr.error(res.error, 'Error');
			  	}
			});
			
			}
			else
			{
				this.toastr.error('Insufficent funds in your card or some technical issue. ', 'Error');
			this.ngxService.stop();
			}
			});
			}
			else{
			this.toastr.error('Please use valid cards.', 'Error');
			this.ngxService.stop();
			}
			});
	  };*/


	getPaymentIntent(){
		// Information about the order
		// Used on the server to calculate order total
		var orderData = {
		  items: [{ id: "photo-subscription" }],
		  currency: "usd"
		};

		this.adminService.postData('createPaymentIntent',orderData).subscribe((response:any) => {
      		console.log(response)
	        if(response.status == 1)
	        {
	        	var stripe = Stripe(response.publicKey);
				  var elements = stripe.elements();
				  var style = {
				    base: {
				      color: "#32325d",
				      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				      fontSmoothing: "antialiased",
				      fontSize: "16px",
				      "::placeholder": {
				        color: "#aab7c4"
				      }
				    },
				    invalid: {
				      color: "#fa755a",
				      iconColor: "#fa755a"
				    }
				  };

				  var card = elements.create("card", { style: style });
				  card.mount("#card-element");

				  this.paymentData =  {
				    stripe: stripe,
				    card: card,
				    clientSecret: response.clientSecret,
				    id: response.id
				  };

				  let self = this;

				  card.on('change', function(event) {
					  var displayError = document.getElementById('card-errors');
					  if (event.error) {
					    displayError.textContent = event.error.message;
					  } else {
					    displayError.textContent = '';
						// self.doPayment(stripe, card, self.paymentData);
					  }
					});
	        	}
	        else{
	        	this.ngxService.stop();
	          	this.valid 		= false;
	          	const message 	= 'Email already exist in our system.';
	  			this.toastr.error(message, response.error);
	        }
      	});
	}

	doPayment(packageData)
  	{
	    const controls = this.homeForm.controls;
	    console.log(controls);
	    // return false;
	    /** check form */
	    if (this.homeForm.invalid)
	    {
	      Object.keys(controls).forEach(controlName =>
	          controls[controlName].markAsTouched()
	      );
	      return;
	    }

	    this.saveCard(packageData);
  	}

  	saveCard(packageData)
  	{
	    // this.ngxService.start();
	    const controls  = this.homeForm.controls;
	    //let userId      = localStorage.setItem('user_id',new Date());
	    // console.log(this.addedData); return false;

		let d = new Date();
			d.setMonth(d.getMonth() + Number(packageData.timePeriod));
		let expiry_datez = d; 
		let expiry_date = expiry_datez.toISOString().split('T')[0]; 
		

	    let dict = {
	      "card_number": controls.card_number.value,
	      "cvv": 		 controls.cvv.value,
	      "exp_month":   controls.exp_month.value,
	      "exp_year":    controls.exp_year.value,
	      //"external_customer_id": userId,
	      "first_name":  localStorage.getItem('signupName').split(' ')[0],
	      "last_name":   localStorage.getItem('signupName').split(' ')[1],
	      "type": "visa",
	      'fullPackage': packageData,
	      'signupName': localStorage.getItem('signupName'),
	      'signupEmail': localStorage.getItem('signupEmail'),
	      'signupUsername': localStorage.getItem('signupUsername'),
	      'signupPassword': localStorage.getItem('signupPassword'),
	      'expiry_date':expiry_date
	    };

	    console.log(dict);
	    
	    this.adminService.postData('storeCreditCardVaultSignup',dict).subscribe((res :any) => {

	        console.log(res)
	        if(res.status == 1)
	        {
          		localStorage.setItem('isLoggedIn', 'true');
	      		localStorage.setItem('user_id', res.data._id);
	      		localStorage.setItem('user_name', res.data.name);
	      		localStorage.setItem('user_email', res.data.email);
	      		localStorage.setItem('portal', res.data.username);

      			const message = 'Your account has been created successfully.';
          		this.toastr.success(message, 'Success');


				this.modalReferenc.close();
				//this.homeForm.reset();

	      		this.router.navigate(['./dashboard']);
	        }
	        else{
	          this.toastr.error('Please use valid cards.', 'Error');
	          this.ngxService.stop();
	        }
	    });
  	};

	/*doPayment()
	{
		// Initiate the payment.
	  	// If authentication is required, confirmCardPayment will automatically display a modal
	  	var data = {
		    card: this.paymentData.card,
		    billing_details: {}
		};
	  	// Use setup_future_usage to save the card and tell Stripe how you plan to charge it in the future
	  	this.paymentData.stripe.confirmCardPayment(this.paymentData.clientSecret, {
	      payment_method: data,
	      setup_future_usage: "off_session"
	    })
	    .then(function(result) {
	    	console.log(result);
	      	if (result.error) {
		        // changeLoadingState(false);
		        var errorMsg = document.querySelector(".sr-field-error");
		        errorMsg.textContent = result.error.message;
		        setTimeout(function() {
		          errorMsg.textContent = "";
		        }, 4000);
	      	} else {
		        // orderComplete(clientSecret);
		        // There's a risk the customer will close the browser window before the callback executes
		        // Fulfill any business critical processes async using a 
		        // In this sample we use a webhook to listen to payment_intent.succeeded 
		        // and add the PaymentMethod to a Customer
	      	}
	    });

	}*/

	
}
