import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserService } from './services/user.service';
import { User } from './model/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: Observable<User>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.user = Observable.fromPromise(this.userService.getCurrentUser());
    this.user.subscribe(user => {
      console.debug('logged in user', user);
      if (!user.id) {
        window.location.href = '/_/';
      }      
    })
    
  }

}