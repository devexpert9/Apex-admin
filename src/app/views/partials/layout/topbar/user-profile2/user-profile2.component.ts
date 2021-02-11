// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../../../pages/core/auth.service';

@Component({
	selector: 'kt-user-profile2',
	templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
	// Public properties
	user$: Observable<User>;

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	name: any = localStorage.getItem('user_name');
	portal:any;

	/**
	 * Component constructor 
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>, public router: Router, public auth: AuthService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
		this.portal = localStorage.getItem('portal');
		this.name = localStorage.getItem('user_name');

		
	}

																																																																									

	/**
	 * Log out
	 */
	logout() {
		this.auth.logout();
		//this.store.dispatch(new Logout());
		localStorage.setItem('isLoggedIn','false');
		localStorage.setItem('user_id','null');
		localStorage.setItem('user_name','null');
		this.router.navigateByUrl('/auth');

	}
}
