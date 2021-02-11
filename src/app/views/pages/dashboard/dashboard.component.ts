import { shuffle } from 'lodash';
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
//import { Product, SellingPoint } from '../../product'
import { ActivatedRoute, Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as data from "../../../data.json";

import { ToastrService } from 'ngx-toastr';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, far, fab);

@Component({ 
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
    filmIcon = faFilm;

    modalReferenc: NgbModalRef;
    homeForm: FormGroup;
    registerForm: FormGroup;
    loading           = false;
    formControls      = {};
    errors: any 		  = [];
    button_name:any 	= '';
    button_url:any		= '';
    selectedFile: any = '';
    user_id: any 		  = localStorage.getItem('user_id');
    fields: any;
    fieldProps: any;
    section_name:any;
    getSectionData:any;
    selectedID:any    = '';
    formSelected: any = '';
    popupName: any    = '';
    proceedURL: any   = '';
    section1: any   = '';
    sectionsHeadings1: any;
    sectionsHeadings2: any;
    sectionsHeadings3: any;
    sectionsHeadings4: any;
    sectionsHeadings5: any;
    sectionsHeadings6: any;
    icons: any = (data as any).default;

    constructor(
      private ngxService: NgxUiLoaderService, 
      private route: ActivatedRoute,
      private router: Router,
      public toastr:ToastrService,private layoutConfigService: LayoutConfigService , private modalService: NgbModal, private fb: FormBuilder, public adminService: AdminService, private changeDetection: ChangeDetectorRef) 
    {
      console.log(this.icons);
      
    }

  	open(content,boxName)
  	{	
  		// var formRows = this.homeForm.controls.newfields.length;
      //   	for(var i=formRows; i >= 0; i--){
      //   		this.homeForm.controls.newfields.removeAt(i);
      //   	}
        

    		this.formSelected = 'add';
        this.popupName    = 'Add Record';
      	this.modalReferenc = this.modalService.open(content, { centered: true });
      	this.section_name = boxName;
      	this.homeForm.reset();
        this.homeForm.patchValue({ 
          selectedIcon: 'fa fa-user'
        });
        this.homeForm.setControl('newfields', new FormArray([]));
  	}

  	editEntry(content,boxName,index,editID)
  	{	
  		this.selectedID = editID;
  		// alert(this.selectedID);
  		this.formSelected = 'edit';
      this.popupName    = 'Edit Record';
  		this.homeForm.reset();
    	this.modalReferenc = this.modalService.open(content, { centered: true });
    	this.section_name = boxName;

    		if(boxName == 'quoteEngines'){
				this.patchValues(this.getSectionData.data.quoteEngines[index]);
			}else if(boxName == 'frontPage'){
				this.patchValues(this.getSectionData.data.frontPage[index]);
			}else if(boxName == 'marketingSystem'){
				this.patchValues(this.getSectionData.data.marketingSystem[index]);
			}else if(boxName == 'preferredCarriers'){
				this.patchValues(this.getSectionData.data.preferredCarriers[index]);
			}else if(boxName == 'virtualSalePlatform'){
				this.patchValues(this.getSectionData.data.virtualSalePlatform[index]);
			}else if(boxName == 'add'){
				this.patchValues(this.getSectionData.data.add[index]);
			}
			else{
			}
  	}

    proceedOpen(){
      window.open(this.proceedURL); 
    }
  	patchValues(pageData)
  	{
      // console.log(pageData.data.button_url);
      // console.log(pageData);
  		console.log(this.homeForm.controls.newfields)
      	this.homeForm.patchValue({
	        button_name: pageData.data.button_name,
	        button_url: pageData.data.button_url,
          selectedIcon: pageData.data.icon
      	});
      	// var formRows = this.homeForm.controls.newfields.length;
      	// for(var i=formRows; i >= 0; i--){
      	// 	this.homeForm.controls.newfields.removeAt(i);
      	// }
      this.homeForm.setControl('newfields', new FormArray([]));
      	if(pageData.data.newfields.length > 0){
	      	this.patchDynamicFieldValues(pageData.data.newfields)
      	}	
    }

    patchDynamicFieldValues(newfields){
    	for(var i=0; i< newfields.length; i++){
    		this.fields = {
	          'label_name': {
	            type: 'text',
	            value: newfields[i].label_name,
	            label:'Enter title',
	          },
	          'label_url': {
	            type: 'text',
	            value: newfields[i].label_url,
	            label:'Enter Info',
	          },
	        };
	        this.fieldProps = Object.keys(this.fields);
	     	const control = <FormArray>this.homeForm.controls.newfields;
	     	control.push(this.initNewFields());
    	}
    }
  
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
          this.initHomeForm();
          this.getPageData();
        }
      }); 
    //-----------------------------------------------------------------

		// Get Section Heading---------------------------------------------
      let dict1 = {
        "user_id": localStorage.getItem('user_id'),
        "section": "1"
      };
      this.adminService.postData('getDashboardSectionData',dict1).subscribe((res :any) => {
          this.sectionsHeadings1 = res.data;
      });

      let dict2 = {
        "user_id": localStorage.getItem('user_id'),
        "section": "2"
      };
      this.adminService.postData('getDashboardSectionData',dict2).subscribe((res :any) => {
          this.sectionsHeadings2 = res.data;
      }); 

      let dict3 = {
        "user_id": localStorage.getItem('user_id'),
        "section": "3"
      };
      this.adminService.postData('getDashboardSectionData',dict3).subscribe((res :any) => {
        this.sectionsHeadings3 = res.data;
      }); 

      let dict4 = {
        "user_id": localStorage.getItem('user_id'),
        "section": "4"
      };
      this.adminService.postData('getDashboardSectionData',dict4).subscribe((res :any) => {
        this.sectionsHeadings4 = res.data;
      }); 

      let dict5 = {
        "user_id": localStorage.getItem('user_id'),
        "section": "5"
      };
      this.adminService.postData('getDashboardSectionData',dict5).subscribe((res :any) => {
        this.sectionsHeadings5 = res.data;
      }); 

      let dict6 = {
        "user_id": localStorage.getItem('user_id'),
        "section": "6"
      };
      this.adminService.postData('getDashboardSectionData',dict6).subscribe((res :any) => {
        this.sectionsHeadings6 = res.data;
      }); 

	}

	initHomeForm()
  {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const nameRegx = /(^\w+)\s?/;


    this.homeForm = this.fb.group({
      button_name: ['', Validators.compose([Validators.required, Validators.pattern(nameRegx)])],
      // button_url: ['', Validators.compose([Validators.required])],
      button_url: ['', Validators.compose([Validators.required, Validators.pattern(urlRegex)])],
      selectedIcon: ['', Validators.compose([Validators.required])],
     	// title: [],
     	newfields: this.fb.array([]),
    	// selling_points: this.fb.array([this.fb.group({label_name:''})]),
    	// selling_url: this.fb.array([this.fb.group({label_url:''})])
    });
  }

    getPageData(){
      let dict = {
        "user_id" : this.user_id
      };
      this.adminService.postData('get_dash_sections',dict).subscribe((response: any) => {
        console.log(response);
        this.getSectionData = response;
        this.changeDetection.detectChanges();
      });
    }

    deleteRow(rowID,index,section)
    {
    	if (confirm('Are you sure you want to delete this entry?'))
    	{
  			let dict = {
  				"_id" : rowID
  			};
  			this.adminService.postData('delete_dash_entry',dict).subscribe((response: any) => {
  				if(section == 'quoteEngines'){
  					this.getSectionData.data.quoteEngines.splice(index,1);
  				}else if(section == 'frontPage'){
  					this.getSectionData.data.frontPage.splice(index,1);
  				}else if(section == 'marketingSystem'){
  					this.getSectionData.data.marketingSystem.splice(index,1);
  				}else if(section == 'preferredCarriers'){
  					this.getSectionData.data.preferredCarriers.splice(index,1);
  				}else if(section == 'virtualSalePlatform'){
  					this.getSectionData.data.virtualSalePlatform.splice(index,1);
  				}else if(section == 'add'){
  					this.getSectionData.data.add.splice(index,1);
  				}
  				else{
  				}

          this.toastr.success('Entry deleted successfully', 'Success');

  				// alert('');
          this.changeDetection.detectChanges();
  			});
  		}
    }

 	get sellingPoints() {
	    return this.homeForm.get('selling_points') as FormArray;
  	}

 	initNewFields(): FormGroup {
	    this.fieldProps.forEach(prop => {
	      this.formControls[prop] = [this.fields[prop].value, Validators.required];
	    });
	    return this.fb.group(this.formControls);
  	}

  	addSellingPoint() {

	 	this.fields = {
          'label_name': {
            type: 'text',
            value: '',
            label:'Enter title',
          },
          'label_url': {
            type: 'text',
            value: '',
            label:'Enter Info',
          },
        };
        this.fieldProps = Object.keys(this.fields);
     	const control = <FormArray>this.homeForm.controls.newfields;
     	control.push(this.initNewFields());

	    // this.sellingPoints.push(this.fb.group({label_name:''}));
	    // this.sellingUrl.push(this.fb.group({label_url:''}));
  	}

  	deleteSellingPoint(index) {
	    const controls =  <FormArray>this.homeForm.controls.newfields;
      controls.removeAt(index);
	    // this.sellingUrl.removeAt(index);
  	}

    submit() {
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
      	
      	// alert(this.selectedID);

      	if(this.formSelected == 'add')
      	{
      		let dict = {
		        "section" : this.section_name,
		        "user_id" : this.user_id,
		        "data" :{
		          "button_name" : controls.button_name.value,
		          "button_url"  : controls.button_url.value,
              "icon"        : controls.selectedIcon.value,
		          "newfields"   : controls.newfields.value,
		        },
		        "index":0,
	      	};

	      	this.adminService.postData('add_dash_section',dict).subscribe((response:any) => {
		        console.log(response);
		        if(response.status == 1)
		        {
		        	this.modalReferenc.close();
		        	this.homeForm.reset();
              this.toastr.success('Entry has been added successfully.', 'Success');
	          	this.getPageData();
		        }
		        else{
              this.toastr.error('Something went wrong. Please try again', 'Error');
		        }
	      	});
      	}
      	else
      	{
      		let dict = {
      			"_id": this.selectedID,
		        "section" : this.section_name,
		        "user_id" : this.user_id,
		        "data" :{
		          "button_name": controls.button_name.value,
		          "button_url" : controls.button_url.value,
              "icon"        : controls.selectedIcon.value,
		          "newfields" : controls.newfields.value,
		        },
		        "index":0,
	      	};

	      	this.adminService.postData('update_dash_sections',dict).subscribe((response:any) => {
		        console.log(response);
		        if(response.status == 1)
		        {
		        	this.modalReferenc.close();
		        	this.homeForm.reset();

              this.toastr.success('Entry has been updated successfully.', 'Success');

		          	this.getPageData();
		        }
		        else{
              this.toastr.error('Something went wrong. Please try again', 'Error');
		        }
	      	});
      	}
      	
    }; 

    close(){
    	this.modalReferenc.close();
    }
    
    viewEntry(content, data)
    {
      this.proceedURL = data.data.button_url;
    	this.modalReferenc = this.modalService.open(content, { centered: true });
      	this.homeForm.patchValue({
	        button_name: data.data.button_name,
	        button_url: data.data.button_url,
          selectedIcon: data.data.icon
      	});
      	      this.homeForm.setControl('newfields', new FormArray([]));

      	if(data.data.newfields.length > 0){
	      	this.patchDynamicFieldValues(data.data.newfields)
      	}	
    }

    radioButtonSelect(icon)
    {
      console.log("ICON VAL = "+ this.homeForm.controls.selectedIcon.value);
      
      if(icon == this.homeForm.controls.selectedIcon.value)
      {
        console.log(icon);
        console.log(this.homeForm.controls.selectedIcon.value);
        return true;
      }
    }

    openWindow(item){
      console.log(item);
      (<any>window).open(item.data.button_url, '','toolbar=1,resizable=0'); return false;
    }

     drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    console.log(event);
    let section_name = event.container.element.nativeElement.classList[0];

    let dropeddata    = event.container.data;

    let dict = {
      "data" : event.container.data,
      "section"  : section_name
    };
    this.adminService.postData('updateDropList', dict).subscribe((response: any) => {
      console.log(response);
      //this.getSectionData = response;
      //this.changeDetection.detectChanges();
    });
  };


  focusFunction(){
    console.log('focus');
  }

  focusOutFunction(sectionName,sectionTitle)
  {
    if(sectionTitle != '')
    {
      let dict = {
        "title"    : sectionTitle,
        "section"  : sectionName,
        "user_id"  : this.user_id
      };

      this.adminService.postData('updateDashboardSection', dict).subscribe((response: any) => {
          console.log(response);
          const message = 'Heading saved successfully.';
          this.toastr.success(message, 'Success');
      });  
    }
    
  }

}
