import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login/login.component';

declare let ga: Function;

import { MaterialModule } from './material/material.module';



describe('AppComponent', () => {
  window['ga'] = function() {}

  let backend: HttpTestingController;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [
        AppComponent,
        LoginComponent
      ],
    }).compileComponents();
    userService = TestBed.get(UserService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
