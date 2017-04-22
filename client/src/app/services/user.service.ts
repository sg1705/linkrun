import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../model/user'

@Injectable()
export class UserService {

  currentUser: User;

  constructor() {

  }

  authenticateUser():User {

    return null;
  }
  

}