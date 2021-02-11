import { Component, OnInit } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'kt-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
	
export class ContactComponent implements OnInit {
    homeForm: FormGroup;
    loading = false;
    errors: any = [];
    banner_image: any;
    banner_text: any = '';
    user_name: any = '';
    user_email: any;
    name: any = '';

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
      private ngxService: NgxUiLoaderService
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
          
          this.getPageData();
          
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
        // name: pageData.name,
        // email: pageData.email,
        phone: pageData.phone,
        address: pageData.address,
        zipcode: pageData.zipcode,
        calendar_url: pageData.calendar_url,
        facebook_url: pageData.facebook_url,
        instagram_url: pageData.instagram_url,
        linkedin_url: pageData.linkedin_url
      });
     // this.banner_image = 'https://www.apex-4u.com:8080/images/'+this.pageData.banner_image;

    }

    initHomeForm()
    {
      const fbRegex     =  /^(?:http(s)?:\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
      const linkedRegex =  /^(?:http(s)?:\/\/)?(?:www.)?linkedin.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
      const instaRegex  =  /^(?:http(s)?:\/\/)?(?:www.)?instagram.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
      // const contactRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
      const contactRegex = /^\(\d{3}\) \d{3}-?\d{4}$/;;
      const emailRegex   = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      const zipRegex      = /^\d{4,6}$/;
      const urlRegex      = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

      this.homeForm = this.fb.group({
        fname: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        phone: ['', Validators.compose([Validators.required, Validators.pattern(contactRegex)])],
        address: [''],
        // address: ['', Validators.compose([Validators.required])],
        zipcode: ['', Validators.compose([Validators.required,  Validators.pattern(zipRegex)])],
        calendar_url: ['', Validators.compose([Validators.required, Validators.pattern(urlRegex)])],
        facebook_url: ['', Validators.compose([Validators.pattern(fbRegex)])],
        instagram_url: ['', Validators.compose([Validators.pattern(instaRegex)])],
        linkedin_url: ['', Validators.compose([Validators.pattern(linkedRegex)])]
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
      
      this.ngxService.start();

      let dict = {
        "page" : "contact",
        "user_id" : this.user_id,
        "data" :{
          "name"     		   : controls.fname.value,
          "email"     		 : controls.email.value,
          "phone"     		 : controls.phone.value,
          "address"     	 : controls.address.value,
          "zipcode"     	 : controls.zipcode.value,
          "calendar_url"    : controls.calendar_url.value,
          "facebook_url"  	: controls.facebook_url.value,
          "instagram_url" 	: controls.instagram_url.value,
          "linkedin_url"  	: controls.linkedin_url.value,
        }
      };

      // console.log(dict); return false;
      this.adminService.postData('add_cmspage',dict).subscribe((response:any) => {
        console.log(response);
        if(response.status == 1){
          localStorage.setItem('user_name',controls.fname.value);
          // this.router.navigate(['./contact']);
          // alert('Contact data saved successfully.');
          const message = 'Contact data saved successfully.';
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