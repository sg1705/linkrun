import { Component } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { UserService } from './services/user.service';
import { User } from './model/user';
import { environment } from '../environments/environment';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user: Observable<User>;

  constructor(
    private userService: UserService,
    public router: Router) {
  }

  title = 'client2';

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.user.subscribe(user => {
      console.debug('logged in user: ', user);
      if (!user.id) {
        window.location.href = '/_/';
      }
      console.log('Environment is production:', environment.production);
    })    
  }



}
