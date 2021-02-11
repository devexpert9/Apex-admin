import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kt-maintext',
  templateUrl: './maintext.component.html',
  styleUrls: ['./maintext.component.scss']
})
export class MaintextComponent implements OnInit {
	homeForm: FormGroup;
    loading = false;
    errors: any = [];
    banner_image: any = '';
    banner_text: any = '';
    imageSizeError: any = '';
    imageBan:any = null;
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
    showError:Boolean = false;
    constructor(
      private fb: FormBuilder,
      public toastr:ToastrService,
      private route: ActivatedRoute,
      private router: Router,
      public adminService: AdminService,
      private ngxService: NgxUiLoaderService,
      private changeDetection: ChangeDetectorRef
    )
    {
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

    getPageData(){
      let dict = {
        "page" : "maintext",
        "user_id" : this.user_id
      };
      this.adminService.postData('getPageData',dict).subscribe((response: any) => {
        console.log(response);
        if(response.status == 1){
          // this.pageData = response.data.data;
          this.patchValues(response.data.data);
        }
        
      });
    }

    patchValues(pageData)
    {
      this.homeForm.patchValue({
        banner_text: pageData.banner_text
      });
      this.imageBan = pageData.banner_image;
      if(this.imageBan != null){
        this.banner_image = 'https://www.apex-4u.com:8080/images/'+pageData.banner_image;
        document.getElementById('ban_img').setAttribute("src",'https://www.apex-4u.com:8080/images/'+pageData.banner_image);
      }
      
      this.changeDetection.detectChanges();
    }

    initHomeForm() {
      this.homeForm = this.fb.group({
        banner_image: [''],
        banner_text: ['']
      });
    }

    // Save Home Data --------------------
    actionCompleteHandler(event){
      console.log(event);
    }

    deleteImage(){
      this.imageBan = null;
      document.getElementById('ban_img').setAttribute("src",'');
    }

    submit()
    {
      const controls = this.homeForm.controls;
      console.log(controls);
      /** check form */

      // if (this.homeForm.invalid)
      // {
      //   Object.keys(controls).forEach(controlName =>
      //     controls[controlName].markAsTouched()
      //   );
      //   return;
      // }

      if(this.imageBan != null){
        if(controls.banner_text.value == null || controls.banner_text.value == ''){
          this.toastr.error('Please add text.', 'Error');
          // this.ngxService.stop();
          return;
        }
      }

      // if(this.banner_image ==  ''){
      //   this.showError = true;
      //   return;
      // }

      if(this.imageSizeError != ''){
        return;
      }
      
      this.ngxService.start();

      if(this.selectedFile != "")
      {
        const formData = new FormData()
        formData.append('image', this.selectedFile, this.selectedFile.name)
        this.adminService.postData('upload_image',formData).subscribe((response) => {
          console.log(response);
          let image = response;
          let dict = {
            "page" : "maintext",
            "user_id" : this.user_id,
            "data" :{
              "banner_text"     : controls.banner_text.value,
              "banner_image"    : image
            }
          };
          this.insertCmsData(dict);
        })
      }
      else
      {
        let dict = {
          "page" : "maintext",
          "user_id" : this.user_id,
          "data" :{
            "banner_text"     : controls.banner_text.value,
            "banner_image"    : this.imageBan
          }
        };
        this.insertCmsData(dict);
      }
    };

    insertCmsData(dict){
      this.adminService.postData('add_cmspage',dict).subscribe((response:any) => {
        console.log(response);
        if(response.status == 1){
          const message = 'Main text saved successfully.';
          this.toastr.success(message, 'Success');
          this.selectedFile = '';
          // alert('Blog data saved successfully.')
          this.ngxService.stop();
        }else{
          alert('Something went wrong, please try again.');
          this.ngxService.stop();
        }
      })
    }

    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.homeForm.controls[controlName];
      if (!control) {
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }


    
    

  public onFileChanged(event) 
  {
    var selectedFile = event.target.files[0];
    this.selectedFile = selectedFile;
    this.showError = false;
    // this.authForm.get('image').setValue(selectedFile);
    console.log(event.target, event.target.files[0])
    const reader = new FileReader();

    let file = event.target.files[0];
    const img = new Image();
    img.src = window.URL.createObjectURL( file );

    reader.onload = () => {

      const width   = img.naturalWidth;
      const height  = img.naturalHeight;

      window.URL.revokeObjectURL( img.src );

      if( width != 400 && height != 400 ) {
        this.imageSizeError = "Image should have dimentions 400 x 400 size";
        this.changeDetection.detectChanges();
        return false;
      }
      else{
        this.imageBan = reader.result;
        this.imageSizeError = "";
        this.banner_image = reader.result;
        this.changeDetection.detectChanges();
        console.log(this.banner_image)  
      }
    };

    reader.readAsDataURL(selectedFile);
  }

   
}