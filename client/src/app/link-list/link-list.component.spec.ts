import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';

import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { LinkServiceSpy } from '../services/link.service.spec';
import { LinkListComponent } from './link-list.component';
import { MaterialModule } from '../material/material.module';
import { FormComponent } from '../form/form.component';

describe('LinkListComponent', () => {
  let component: LinkListComponent;
  let fixture: ComponentFixture<LinkListComponent>;
  let linkServiceSpy: LinkService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkListComponent, FormComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule.withRoutes([
          {
            path: 'link/create',
            component: FormComponent
          },
          {
            path: 'links',
            component: LinkListComponent
          }          
        ])]
    })
    .overrideComponent(LinkListComponent, {
      set: {
        providers: [
          { provide: LinkService, useClass: LinkServiceSpy }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkListComponent);
    component = fixture.componentInstance;
    linkServiceSpy  = fixture.debugElement.injector.get(LinkService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute getLinks on init', () => {
    expect(linkServiceSpy.getLinks).toHaveBeenCalledTimes(1);
  })

  it('should fetch 1 link', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.links.length).toEqual(1);
    })
    
  })
});


