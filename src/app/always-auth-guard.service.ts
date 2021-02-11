import { Injectable } from '@angular/core';
import {CanActivate} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

// @NgModule({
//   	providers: [
// 		AlwaysAuthGuard
//   	]
// })

export class AlwaysAuthGuardService implements CanActivate {
	canActivate()
	{
		console.log("AlwaysAuthGuard");
		return true;
	}
  	constructor() { }
}
