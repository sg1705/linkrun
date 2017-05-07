import { async, fakeAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Router } from "@angular/router";

import { MaterialModule} from '../material/material.module';
import { FormBuilder,FormGroup} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { LinkListComponent } from '../link-list/link-list.component';
import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { LinkServiceSpy } from '../services/link.service.spec';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        FormComponent,
        LinkListComponent
      ],
      imports: [MaterialModule, ReactiveFormsModule,
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
    .overrideComponent(FormComponent, {
      set: {
      providers: [
        LinkService,
        MockBackend,
        { provide: Router, useClass: RouterStub },
        { provide: Location, useClass: SpyLocation },
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]                    
        }]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router          = fixture.debugElement.injector.get(Router);
    location        = fixture.debugElement.injector.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two input fields', () => {
    expect(fixture.nativeElement.querySelectorAll('input').length).toEqual(2);
  })

  it('should have one text area field', () => {
    expect(fixture.nativeElement.querySelectorAll('textarea').length).toEqual(1);
  })


  it('form value should update from form changes', fakeAsync(() => {
    updateForm('testLink', 'testUrl', 'testDescription');
    expect(component.linkFormGroup.value['link']).toEqual('testLink');
    expect(component.linkFormGroup.value['url']).toEqual('testUrl');
  }));

  it('pass the form values to backend', () => {
      // update form
      updateForm('testLink', 'testUrl', 'testDescription');
      let mockLink = new Link(0, 'testLink', 'testUrl', 'testDescription');

      let mockBackend = fixture.debugElement.injector.get(MockBackend);
      //respond to a mock connection
      mockBackend.connections.subscribe(conn => {
        let submittedLink = JSON.parse(conn.request.getBody());
        expect(submittedLink['link']).toEqual('testLink');
        expect(submittedLink['url']).toEqual('testUrl');
        expect(submittedLink['description']).toEqual('testDescription');
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockLink) })));
      });

      //submit form
      fixture.componentInstance.onSubmit(fixture.componentInstance.linkFormGroup.value).then(done => {        
          //check for route url
          console.log(router);
          console.log(location);
          expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      });
  });

  function updateForm(link, url, description) {
    component.linkFormGroup.controls['link'].setValue(link);
    component.linkFormGroup.controls['url'].setValue(url);
    component.linkFormGroup.controls['description'].setValue(description);
  }

});


class RouterStub {
  url = '/link/create';
  navigateByUrl = jasmine.createSpy('navigateByUrl').and.callFake(
    (url) => Promise.resolve(url).then(url => {
      this.url = url;
    }));
}