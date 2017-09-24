import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import { MdTableModule } from '@angular/material';
import { fakeAsync, async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';

import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { LinkServiceSpy } from '../services/link.service.spec';
import { UserService } from '../services/user.service';
import { UserServiceSpy } from '../services/user.service.spec';
import { LinkListComponent } from './link-list.component';
import { MaterialModule } from '../material/material.module';
import { FormComponent } from '../form/form.component';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import 'rxjs/Rx';


describe('LinkListComponent', () => {
  let component: LinkListComponent;
  let fixture: ComponentFixture<LinkListComponent>;
  let linkServiceSpy: LinkService;
  let userServiceSpy: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkListComponent, FormComponent ],
      imports: [
        ReactiveFormsModule,
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,    
        MaterialModule,
        MdTableModule,
        CdkTableModule,
        RouterTestingModule.withRoutes([
          {
            path: 'link/create',
            component: FormComponent
          },
          {
            path: 'links',
            component: LinkListComponent
          }          
        ]),
      ]
    })
    .overrideComponent(LinkListComponent, {
      set: {
        providers: [
          { provide: LinkService, useClass: LinkServiceSpy },
          { provide: UserService, useClass: UserServiceSpy }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkListComponent);
    component = fixture.componentInstance;
    linkServiceSpy  = fixture.debugElement.injector.get(LinkService);
    userServiceSpy = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute getUser on init', () => {
    fixture.whenStable().then(() => {
      expect(userServiceSpy.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  })


  // it('should execute getLinks on init', () => {
  //   fixture.whenStable().then(() => {
  //     expect(linkServiceSpy.getLinks).toHaveBeenCalledTimes(1);
  //   })
  // })

  // it('should get links #2', fakeAsync(() => {
  //   expect(linkServiceSpy.getLinks).toHaveBeenCalledTimes(1);
  // }));


  it('should fetch 1 link', () => {
    fixture.whenStable().then(() => {
      fixture.componentInstance.dataSource.connect(null).subscribe(links => {
        expect(links.length).toEqual(1);
        expect(linkServiceSpy.getLinks).toHaveBeenCalledTimes(1);
      })
      // expect(fixture.componentInstance.links.length).toEqual(1);
    })    
  })
});


