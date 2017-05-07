import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { Router } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule} from './material/material.module';
import { FormComponent } from './form/form.component';
import { LinkListComponent } from './link-list/link-list.component';

import { UserService } from './services/user.service';
import { UserServiceSpy } from './services/user.service.spec';
import { User } from './model/user';


let userServiceSpy: UserService;
let router: Router;
let location: Location;
let fixture: ComponentFixture<AppComponent>;


describe('AppComponent', () => {
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FormComponent,
        LinkListComponent
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'link/create',
            component: FormComponent
          },
          {
            path: 'links',
            component: LinkListComponent
          }          
        ])
      ]
    })
    .overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: UserServiceSpy }
        ]
      }
    }).compileComponents();

    //initialize test stuff
    fixture         = TestBed.createComponent(AppComponent);
    userServiceSpy  = fixture.debugElement.injector.get(UserService);
    router          = TestBed.get(Router);
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));



  it('should get current user in the construtor', () => {
    expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      userServiceSpy.getCurrentUser().then(user => {
        expect(user.email).toEqual('sg1705@gmail.com');
      })
    })
  });

  it('should contain two buttons to navigate', () => {
    let tabButtons = fixture.nativeElement.querySelectorAll('button');
    expect(tabButtons[0].textContent).toContain('My Links');
    expect(tabButtons[1].textContent).toContain('New Link');
  })

  it('should navigate to new link form when clicked', () => {
    let tabButtons = fixture.nativeElement.querySelectorAll('button');
    tabButtons[1].click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(router.url).toContain('/link/create');
    })
  })

  it('should navigate to link list when clicked', () => {
    let tabButtons = fixture.nativeElement.querySelectorAll('button');
    tabButtons[0].click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(router.url).toContain('/links');
    })
  })
});