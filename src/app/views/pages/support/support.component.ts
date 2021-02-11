import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'kt-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
	id: any;
  	constructor(public route: ActivatedRoute, public router: Router, public adminService: AdminService, public auth: AuthService) { }

  	ngOnInit() {
  		this.id = this.route.snapshot.paramMap.get('id');
  		console.log(this.id);
  		this.getInfoAboutAgent();
  	}

    openUrl(page){
  		this.router.navigate(['/' + this.id + page]);
  	}

  	getInfoAboutAgent(){

		const authData = {
			_id: this.id
		};

		this.adminService.postData('get_info_about_agent',authData).subscribe((res :any) => {
      		console.log(res)
      		if(res.status == 1)
      		{	
      			this.auth.login();
      			localStorage.setItem('isLoggedIn', 'true');
	      		localStorage.setItem('user_id', res.data._id);
	      		localStorage.setItem('user_name', res.data.name);
            localStorage.setItem('user_mail', res.data.email);
            localStorage.setItem('portal', res.data.username);
	      		this.router.navigate(['./dashboard']);
	      	}
	      	else{
	      		// this.loading = false;
	      		console.log(res);
	      		this.router.navigate(['./auth']);
	      	}
	    });
  	}

}
//this.router.navigate( [ routing.path ] , { relativeTo: route , queryParams: paramsInUrl } );
