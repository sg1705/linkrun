import { async, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

//import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/common/http';

import { UserService } from './user.service';

describe('UserService', () => {

  let httpClient: HttpClient;
  let backend: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [ HttpClientTestingModule ]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    backend = TestBed.get(HttpTestingController);
    userService = TestBed.get(UserService);

  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should get current user from backend', () => {

    const mockResponse = {
      email: "sg1705@gmail.com",
      fName: "Saurabh",
      id:5715921523965952,
      lName: "Gupta",
      orgId: 5704147139559424,
      picture: "https://lh5.googleusercontent.com/-EKWz1QcfjGg/AAAAAAAAAAI/AAAAAAAAEdM/rQpQ4Z44pRA/photo.jpg",
      orgName: "sg1705@gmail.com"
    }

    userService.getCurrentUser().subscribe(user => {
      expect(user.fName).toEqual(mockResponse.fName);
    });
    backend.expectOne('/__/api/users').flush(mockResponse);
  });


});
