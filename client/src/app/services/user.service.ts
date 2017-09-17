import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../model/user';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

  private apiUrl: string = '/__/api/users';
  private currentUser: User;

  constructor(private http: Http) {

  }

  getCurrentUser(): Promise<User> {
    if (this.currentUser == null) {
      //make a network call to get user
      return this.http.get(this.apiUrl)
        .toPromise().then(res => {
          var data = res.json();
          var user = new User(
            data.id,
            data.orgId,
            data.fName,
            data.lName,
            data.picture,
            data.email,
            data.orgName
          );
          this.currentUser = user;
          return this.currentUser;
        })

    } else {
      return new Promise<User>((resolve, reject) => {
        resolve(this.currentUser);
      });
    }
  }

  getAllUsers(): Promise<Array<User>> {
      //make a network call to get user
      return this.http.get(this.apiUrl+'/allusers')
        .toPromise().then(res => {
          var data = res.json();
          var users = new Array<User>();
          data.forEach(element => {
            var user = new User(
              element.id,
              element.orgId,
              element.fName,
              element.lName,
              element.picture,
              element.email,
              element.orgName
            );
            users.push(element);
          });
          return users;
        })
  }
}


