import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'kt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    homeForm: FormGroup;
    loading = false;
    errors: any = [];
    banner_image: any;
    banner_text: any 	= '';
    user_name: any 		= '';
    user_email: any;
    name: any 			= '';

    username:any 		 = '';
    expirydate:any 		 = '';
    registrationdate:any = '';
    password:any = '';

    public tools: object = {
      items: [ 
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
                'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
    }; 
    public tools2: object = {
      items: [
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
                'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
    }; 
    public tools3: object = {
      items: [
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
                'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
    }; 
    public tools4: object = {
      items: [
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
                'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
    };

    selectedFile: any = '';
    user_id: any = localStorage.getItem('user_id');
    constructor(
      private fb: FormBuilder,
      private router: Router,
      public toastr:ToastrService,
      private route: ActivatedRoute,
      public adminService: AdminService,
      private ngxService: NgxUiLoaderService,
      private changeDetection: ChangeDetectorRef
    ) {
    }

    ngOnInit() 
    {
    this.initHomeForm();
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
        	this.username 			= res.data.username;
        	this.expirydate 		= res.data.expiry_date;
        	this.registrationdate 	= res.data.created_on;
        	this.password 			= res.data.password;
        	
        	this.changeDetection.detectChanges();

          	this.patchValues(res.data);
        }
      }); 
    //-----------------------------------------------------------------
    
      
    }

    getPageData()
    {
      let dict = {
        "page" : "contact",
        "user_id" : this.user_id
      };
      this.adminService.postData('getPageData',dict).subscribe((response: any) => {
        console.log(response);
        if(response.status == 1){
          // this.pageData = response.data.data;
          this.patchValues(response.data.data);
          this.getLoginUserData();
        }
        
      });
    }

    getLoginUserData()
    {
      let dict = {
        "page" : "contact",
        "id" : this.user_id
      };
      this.adminService.postData('getUserByID',dict).subscribe((response: any) => {
        console.log("User = "+response);
        if(response.status == 1){
          // this.pageData = response.data.data;
          // this.patchValues(response.data.data);
          this.user_name  = response.data.name;
          this.user_email = response.data.email;
          this.homeForm.patchValue({
            fname: response.data.name,
            email: response.data.email,
          });
        }
        
      });
    }

    patchValues(pageData){
      this.homeForm.patchValue({
        name: pageData.name,
        email: pageData.email,
        phone: pageData.contact,
        address: pageData.address,
        city: pageData.city,
        state: pageData.state,
        zipcode: pageData.zip,
        registrationdate: pageData.registrationdate,
        expirydate: pageData.expirydate
      });
    }

    initHomeForm()
    {
    	let regexpFullname = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      	const contactRegex = /^\(\d{3}\) \d{3}-?\d{4}$/;;
      	const emailRegex 	 = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      	const zipRegex     = /^\d{4,6}$/;
        let regexp = /^\S*$/;

      	this.homeForm = this.fb.group({
	        name: ['', Validators.compose([Validators.required, Validators.pattern(regexpFullname)])],
	        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
	        phone: ['', Validators.compose([Validators.required, Validators.pattern(contactRegex)])],
	        address: [''],
	        // address: ['', Validators.compose([Validators.required])],
	        city: ['', Validators.compose([Validators.required])],
	        state: ['', Validators.compose([Validators.required])],
	        zipcode: ['', Validators.compose([Validators.required,  Validators.pattern(zipRegex)])],
          old_password: [''],
          new_password: [''],
          confirm_password: [''],
      	});
    }

    // Save Home Data --------------------
    actionCompleteHandler(event){
      console.log(event);
    }

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

      if(controls.old_password.value != '' || controls.new_password.value != '' || controls.confirm_password.value != '')
      {
        if(controls.old_password.value == '')
        {
          this.toastr.error('Please enter old password.', 'Error');
          this.ngxService.stop();
          return;
        }else if(controls.old_password.value != this.password){
          this.toastr.error('Please enter correct old password.', 'Error');
          this.ngxService.stop();
          return;
        }else if(controls.new_password.value == '') {
          this.toastr.error('Please enter new password.', 'Error');
          this.ngxService.stop();
          return;
        }else if(controls.new_password.value != ''){
          let regexp = /^\S*$/;
          // if(inputText.value.match(mailformat))
          if(controls.new_password.value.length < 6){
            this.toastr.error('Please enter minimum 6 characters for new password.', 'Error');
            this.ngxService.stop();
            return;
          }else if(controls.new_password.value.length > 15){
            this.toastr.error('Please enter maximum 15 characters for new password.', 'Error');
            this.ngxService.stop();
            return;
          }
          else if(controls.new_password.value != controls.confirm_password.value)
          {
            this.toastr.error('Confirm password should match with new password ', 'Success');
            this.ngxService.stop();
            return;
          }
          else{
            this.password = controls.new_password.value;
          }
        }

      }

      this.ngxService.start();

      	let dict = {
          "_id" 	  		: localStorage.getItem('user_id'),
          "name"    		: controls.name.value,
          "username"		: this.username,
          "email"   		: controls.email.value,
          "password"		: this.password,
          "contact"   	: controls.phone.value,
          "zip"     		: controls.zipcode.value,
          "state"     	: controls.state.value,
          "city"     		: controls.city.value,
          "country"     : "",
          "address" 		: controls.address.value,
          "created_on"	: this.registrationdate,
          "expiry_date" : this.expirydate
        };

        // console.log(dict); return false;

      this.adminService.postData('update_user',dict).subscribe((response:any) => {
        if(response.status == 1)
        {
          const message = 'Profile data saved successfully.';
          this.toastr.success(message, 'Success');
          this.ngxService.stop();

        }else{
          const message = 'Something went wrong, please try again.';
          this.toastr.error(message, 'Error');
          this.ngxService.stop();
        }
      })
    };

    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.homeForm.controls[controlName];
      if (!control) {
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }


  	public onFileChanged(event) {
	    var selectedFile = event.target.files[0];
	    this.selectedFile = selectedFile;
	    // this.authForm.get('image').setValue(selectedFile);
	    console.log(event.target, event.target.files[0])
	    const reader = new FileReader();
	    reader.onload = () => {
	      this.banner_image = reader.result;
	      console.log(this.banner_image)
	    };
	    reader.readAsDataURL(selectedFile);
  	}
}