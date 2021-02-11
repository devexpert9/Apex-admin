import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { PublisheventService } from '../../../services/publishevent.service';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'kt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   @ViewChild('sectionDiv', {static: false}) sectionDiv: ElementRef;
  homeForm: FormGroup;
  loading = false;
  errors: any = null;
  banner_image: any = '';
  banner_text: any = '';
  pageData: any = [];
  errorChk:any = '';
  imageSizeError:any='';
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
  showError: Boolean = false;
  imageBan:any = null;
  cmsData:any;
  sections:any;
  conditionalSections:any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    public adminService: AdminService,
    public publisheventService: PublisheventService,
    public toastr:ToastrService,
    private ngxService: NgxUiLoaderService,
    private changeDetection: ChangeDetectorRef
  )
  {
  }

  ngOnInit(){
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
        "page" : "home",
    };
    this.adminService.postData('getAllSections',dict).subscribe((response: any) => {
      console.log("SECTIONS = "+response.data);
      this.sections = response.data;
      let assignValues = [];
      for(var i=0; i<this.sections.length; i++){
        let dictSection = {
          "name"    : this.sections[i].name,
          "message" : this.sections[i].message,
          "status"  : this.sections[i].status,
          "image"   : this.sections[i].image,
          "_id" : this.sections[i]._id,
          "text": '',
          "url": ''
        };

        assignValues.push(dictSection);
      }

      let dict = {
        "page" : "home",
        "user_id" : this.user_id
      };
      this.adminService.postData('getPageData',dict).subscribe((response: any) => {
        console.log(response);
        if(response.status == 1){
          this.pageData = response.data.data;
          this.patchValues();
          //add props to sections
          
          //add values to props
          for(var i=0; i<assignValues.length; i++){
            for(var k=0; k < response.data.data.sectionData.length; k++){
              if(assignValues[i]._id == response.data.data.sectionData[k].id){
                let dictSection = {
                  "name"    : this.sections[i].name,
                  "message" : this.sections[i].message,
                  "status"  : this.sections[i].status,
                  "image"   : this.sections[i].image,
                  "_id" : this.sections[i]._id,
                  "text": response.data.data.sectionData[k].text,
                  "url": response.data.data.sectionData[k].url,
                  "isChecked": response.data.data.sectionData[k].isChecked
                };

                assignValues.splice(i,1, dictSection);
              }
            }
          }

          this.sections = assignValues;
          console.log('here latest');
          console.log(this.sections)
          this.changeDetection.detectChanges();
        }else{

          this.sections = assignValues;
          console.log('here latest');
          console.log(this.sections)
          this.changeDetection.detectChanges();
        }
      });
      

    });
  }

  initHomeForm()
  { 
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.homeForm = this.fb.group({
      // disability_url: ['', Validators.compose([ Validators.required , Validators.pattern(urlRegex)])],
      // disability_urltext: ['', Validators.compose([Validators.required])],
      // self_url: ['', Validators.compose([Validators.required, Validators.pattern(urlRegex)])],
      // self_urltext: ['', Validators.compose([Validators.required])],
      // casuality_url: ['', Validators.compose([Validators.required, Validators.pattern(urlRegex)])],
      // casuality_urltext: ['', Validators.compose([Validators.required])],
      banner_image: [''],
      banner_text: ['', Validators.compose([Validators.required])],
      template: ['version1', Validators.compose([Validators.required])],
    });
  }

  patchValues(){
    this.homeForm.patchValue({
      banner_text: this.pageData.banner_text,
      // self_url: this.pageData.self_url,
      // self_urltext: this.pageData.self_urltext,
      // casuality_url: this.pageData.casuality_url,
      // casuality_urltext: this.pageData.casuality_urltext,
      // disability_url: this.pageData.disability_url,
      // disability_urltext: this.pageData.disability_urltext,
      template: this.pageData.template
    });
    // alert(this.pageData.banner_text);
    this.imageBan = this.pageData.banner_image;
    this.banner_image = 'https://www.apex-4u.com:8080/images/'+this.pageData.banner_image;
    document.getElementById('ban_img').setAttribute("src",'https://www.apex-4u.com:8080/images/'+this.pageData.banner_image);

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

    if(this.banner_image == ''){
      this.showError = true;
      return;
    }

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
        let sectionData = [];
        let div = this.sectionDiv.nativeElement as HTMLElement;
        for(var i=0; i<div.children.length; i++)
        {
          let dict = {
            'id': this.sections[i]._id,
            'text': (<HTMLInputElement>div.children[i].children[0].children[2].lastChild).value,
            'url': (<HTMLInputElement>div.children[i].children[0].children[1].lastChild).value,
            'isChecked': (<HTMLInputElement>div.children[i].children[0].children[0].children[0]).checked
          };
          sectionData.push(dict);
        }
        console.log(sectionData);
        let dict = {
          "page" : "home",
          "user_id" : this.user_id,
          "data" :{
            "banner_text"     : controls.banner_text.value,
            "banner_image"    : image,
            "sectionData": sectionData,
            // "disability_url"  : controls.disability_url.value,
            // "disability_urltext"  : controls.disability_urltext.value,
            // "casuality_url"   : controls.casuality_url.value,
            // "casuality_urltext"   : controls.casuality_urltext.value,
            // "self_url"        : controls.self_url.value,
            // "self_urltext"        : controls.self_urltext.value,
            "template"        : controls.template.value,
          }
        };
        this.insertCmsData(dict);
      })
    }
    else{

      let sectionData = [];
      let div = this.sectionDiv.nativeElement as HTMLElement;
        for(var i=0; i<div.children.length; i++)
        {
          // let dict = {
          //   'id': this.sections[i]._id,
          //   'text': (<HTMLInputElement>div.children[i].childNodes[1].lastChild).value,
          //   'url': (<HTMLInputElement>div.children[i].childNodes[0].lastChild).value
          // };
          let dict = {
            'id': this.sections[i]._id,
            'text': (<HTMLInputElement>div.children[i].children[0].children[2].lastChild).value,
            'url': (<HTMLInputElement>div.children[i].children[0].children[1].lastChild).value,
            'isChecked': (<HTMLInputElement>div.children[i].children[0].children[0].children[0]).checked
          };
          sectionData.push(dict);
        }

        let dict = {
        "page" : "home",
        "user_id" : this.user_id,
        "data" :{
          "banner_text"     : controls.banner_text.value,
          "banner_image"    : this.imageBan,
          "sectionData": sectionData,
          // "disability_url"  : controls.disability_url.value,
          // "disability_urltext"  : controls.disability_urltext.value,
          // "casuality_url"   : controls.casuality_url.value,
          // "casuality_urltext"   : controls.casuality_urltext.value,
          // "self_url"        : controls.self_url.value,
          // "self_urltext"        : controls.self_urltext.value,
          "template"        : controls.template.value,
        }
      };
      this.insertCmsData(dict);
    }
  };


  insertCmsData(dict)
  {
    
    this.adminService.postData('add_cmspage',dict).subscribe((response:any) => {
      console.log(response);
      if(response.status == 1)
      {
        const message = 'Home data saved successfully.';
        this.toastr.success(message, 'Success');

        this.publisheventService.newEvent('eventName');

        let dict = {
            "page" : "home",
            "user_id" : this.user_id
        };
        this.adminService.postData('getPageData',dict).subscribe((response: any) => {
            console.log(response);
            this.errorChk = response;
            this.ngxService.stop();
        });

      }else{
        this.toastr.error('Something went wrong, please try again.', 'Error');
        this.ngxService.stop();
      }
      // this.spinnerService.hide();
      // this.rows1 = response.data;
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
    var selectedFile  = event.target.files[0];
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

      if( width != 300 && height != 300 ) 
      {
        this.imageSizeError = "Image should have dimentions 300 x 300 size";
        this.changeDetection.detectChanges();
        return false;
      }
      else{
        this.imageSizeError = "";
        this.banner_image = reader.result;
        this.changeDetection.detectChanges();
        console.log(this.banner_image)  
      }
    };

    reader.readAsDataURL(selectedFile);

  }
 


}
