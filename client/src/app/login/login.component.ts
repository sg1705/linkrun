import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  fName: string;
  lName: string;
  picture: string;

  constructor(private userService:UserService) {
    this.userService.getCurrentUser().then(user => {
      this.user = user;
      this.fName = user.fName;
      this.lName = user.lName;
      this.picture = user.picture;
    });
  }

  ngOnInit() {
  }

  logout() {
    console.log('logout');
    this.userService.logout();
  }
}
