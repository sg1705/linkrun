import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../model/user';
import 'rxjs/add/operator/toPromise';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UserService {

  private apiUrl: string = '/__/api/users';
  private currentUser: User;
  private currUser:Subject<User> = new Subject();

  constructor(private http: Http) {
    this.http.get(this.apiUrl)
      .toPromise().then(res => {
        var data = res.json();
        var user = new User(
          data.id,
          data.orgId,
          data.fName,
          data.lName,
          data.picture,
          data.email,
          data.orgName,
          data.orgAllowsPublic
        );
        this.currUser.next(user);
      })
  }

  getCurrentUser():Observable<User> {
    return this.currUser;
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
              element.orgName,
              element.orgAllowsPublic
            );
            users.push(element);
          });
          return users;
        })
  }
}


