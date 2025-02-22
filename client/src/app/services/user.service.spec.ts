import { async, TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { UserService } from './user.service';
import { User } from '../model/user';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]          
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be able to be created...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  describe('Get user from backend', () => {
    const mockResponse = {
      email: "sg1705@gmail.com",
      fName: "Saurabh",
      id:5715921523965952,
      lName: "Gupta",
      orgId: 5704147139559424,
      picture: "https://lh5.googleusercontent.com/-EKWz1QcfjGg/AAAAAAAAAAI/AAAAAAAAEdM/rQpQ4Z44pRA/photo.jpg",
      orgName: "sg1705@gmail.com"
    }

    it('should get current user from backend', async(
      inject([UserService, MockBackend], ((service: UserService, mockBackend: MockBackend) => {
        //respond to a mock connection
        mockBackend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        });
        
        service.getCurrentUser().then(user => {
          expect(user.id).toEqual(5715921523965952);
          expect(user.email).toEqual('sg1705@gmail.com');
          expect(user.orgName).toEqual('sg1705@gmail.com');
        });

      }))
    ));
  })
});

export class UserServiceSpy {
  testUser = new User(
    5715921523965952,
    5704147139559424,
    "Saurabh",
    "Gupta",
    "https://lh5.googleusercontent.com/-EKWz1QcfjGg/AAAAAAAAAAI/AAAAAAAAEdM/rQpQ4Z44pRA/photo.jpg",
    "sg1705@gmail.com",
    "sg1705@gmail.com"
  )

  getCurrentUser = jasmine.createSpy('getCurrentUser').and.callFake(
    () => Promise
      .resolve(true)
      .then(() => Object.assign({}, this.testUser))
  );
}